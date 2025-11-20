import {html, nothing} from 'lit'

import {clamp} from '../../../../../tools/numerical.js'
import {LayoutMeta} from '../utils/layout-meta.js'
import {Dock, Surface} from '../../../../../layout/types.js'
import {icon_feather_x} from '../../../icons/groups/feather/x.js'

const DRAG_THRESHOLD = 3

const dragState = new WeakMap<HTMLElement, {
	id: number
	axis: 'x' | 'y'
	origin: {x: number, y: number}
	bounds: {min: number, max: number}
	lifted: boolean
}>()

const getDockTarget = (e: PointerEvent) => {
	const hit = document.elementFromPoint(e.clientX, e.clientY)
	return hit?.closest('[data-dock-id]') as HTMLElement | null
}

const getAxis = (dock: Dock) =>
	(dock.taskbarAlignment === 'left' || dock.taskbarAlignment === 'right')
		? 'y'
		: 'x'

const getOrigin = (e: PointerEvent) => ({
	x: e.clientX,
	y: e.clientY
})

const getBounds = (axis: 'x' | 'y', c: DOMRect, t: DOMRect) =>
	axis === 'x'
		? {min: c.left - t.left, max: c.right - t.right}
		: {min: c.top - t.top, max: c.bottom - t.bottom}

export const createDragHandlers = (meta: LayoutMeta, dock: Dock, surface: Surface) => ({
	onDown: (e: PointerEvent) => {
		if (e.button !== 0) return

		const btn = e.currentTarget as HTMLElement
		if (dragState.has(btn)) return

		const dockEl = btn.closest('[data-dock-id]')
		const tabs = dockEl?.querySelector('.tabs') as HTMLElement | null
		if (!tabs) return

		const axis = getAxis(dock)
		const c = tabs.getBoundingClientRect()
		const t = btn.getBoundingClientRect()

		dragState.set(btn, {
			id: e.pointerId,
			axis,
			lifted: false,
			origin: getOrigin(e),
			bounds: getBounds(axis, c, t)
		})

		btn.setPointerCapture(e.pointerId)
	},

	onMove: (e: PointerEvent) => {
		const btn = e.currentTarget as HTMLElement
		const s = dragState.get(btn)
		if (!s) return

		const dx = e.clientX - s.origin.x
		const dy = e.clientY - s.origin.y

		if (!s.lifted) {
			if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)
				return

			s.lifted = true
			btn.style.transition = 'none'
			const tabs = btn.closest('.tabs') as HTMLElement
			const tab = btn.closest('.tab')

			if(tab && tabs) {
				const rect = tab.getBoundingClientRect()
				const size = s.axis === 'x' ? rect.width : rect.height
				tabs.style.setProperty('--tab-shift-size', `${size}px`)
			}

			meta.dragger.start(surface.id)
		}

		const tabs = btn.closest('.tabs') as HTMLElement | null
		const clampBounds = tabs?.getBoundingClientRect()
		const primaryInside = clampBounds
			? (s.axis === 'x'
				? e.clientX >= clampBounds.left && e.clientX <= clampBounds.right
				: e.clientY >= clampBounds.top && e.clientY <= clampBounds.bottom)
			: false

		const primaryOffsetRaw = s.axis === 'x' ? dx : dy
		const crossOffsetRaw = s.axis === 'x' ? dy : dx

		const primaryOffset = (clampBounds && primaryInside)
			? clamp(primaryOffsetRaw, s.bounds.min, s.bounds.max)
			: primaryOffsetRaw

		const crossOffset = primaryInside ? 0 : crossOffsetRaw

		const offsetX = s.axis === 'x' ? primaryOffset : crossOffset
		const offsetY = s.axis === 'y' ? primaryOffset : crossOffset

		btn.style.transform = `translate(${offsetX}px,${offsetY}px)`

		const target = getDockTarget(e) || btn.closest('[data-dock-id]')

		if (target)
			meta.dragger.preview(target, {x: e.clientX, y: e.clientY})
		else
			meta.dragger.clearPreview()
	},

	onEnd: async (e: PointerEvent) => {
		const btn = e.currentTarget as HTMLElement
		const tabs = btn.closest('.tabs') as HTMLElement | null

		dragState.delete(btn)
		btn.releasePointerCapture(e.pointerId)

		const animatables = tabs
			? Array.from(tabs.querySelectorAll<HTMLElement>('.tab, button'))
			: []

		animatables.forEach(el => el.style.transition = 'none')

		await meta.dragger.drop()

		requestAnimationFrame(() => {
			btn.style.transform = ''
			btn.style.transition = ''
			tabs?.style.removeProperty('--tab-shift-size')

			requestAnimationFrame(() => {
				animatables.forEach(el => el.style.transition = '')
			})
		})
	}
})

export const OrdinaryTab = ({
	meta, dock, surface, surfaceIndex
}: {
  meta: LayoutMeta
  dock: Dock
  surface: Surface
  surfaceIndex: number
}) => {
	const {icon, label} = meta.studio.panels[surface.panel]
	const active = dock.activeChildIndex === surfaceIndex
	const isDragged = meta.dragger.isSurfaceDragging(surface.id)
	const handlers = createDragHandlers(meta, dock, surface)

	const insideXButton = (event: MouseEvent) => {
		const target = event.target as Element
		const tab = event.currentTarget as HTMLElement
		const x = tab.querySelector(".x") as HTMLElement
		return event.target === x || x.contains(target)
	}

	const close = () => meta
		.studio
		.layout
		.actions
		.deleteSurface(surface.id)

	const activate = () => meta
		.studio
		.layout
		.actions
		.setDockActiveSurface(dock.id, surfaceIndex)

	const click = (event: MouseEvent) => {
		if (!active) {
			activate()
			return
		}
		if (insideXButton(event))
			close()
	}

	return html`
		<div class=tab
  		data-tab-for-surface=${surface.id}
  		data-shift=${meta.dragger.calculateShift(dock.id, surfaceIndex, surface.id) ?? nothing}
  	>
  		<button
  			data-ordinary
      	title=${label}
      	?data-active=${active}
      	?data-drag-source=${isDragged}
      	@click=${click}
      	@pointerdown=${handlers.onDown}
      	@pointermove=${handlers.onMove}
      	@pointerup=${handlers.onEnd}
      	@pointercancel=${handlers.onEnd}
      >
      	<span class=icon>${icon({dock, meta})}</span>
      	<span class=x ?data-available=${active}>${active ? icon_feather_x : nothing}</span>
  		</button>
		</div>
  `
}
