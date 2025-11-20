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

const getDelta = (e: PointerEvent, s: {axis: 'x' | 'y', origin: {x: number, y: number}}) =>
	s.axis === 'x'
		? e.clientX - s.origin.x
		: e.clientY - s.origin.y

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

		const dx = Math.abs(e.clientX - s.origin.x)
		const dy = Math.abs(e.clientY - s.origin.y)

		if (!s.lifted) {
			if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD)
				return

			s.lifted = true
			btn.style.transition = 'none'
			meta.dragger.start(surface.id)
		}

		const delta = getDelta(e, s)
		const offset = clamp(delta, s.bounds.min, s.bounds.max)

		btn.style.transform =
			s.axis === 'x'
				? `translate(${offset}px,0)`
				: `translate(0,${offset}px)`

		const target =
			getDockTarget(e) ||
			btn.closest('[data-dock-id]')

		if (target)
			meta.dragger.preview(target, {x: e.clientX, y: e.clientY})
		else
			meta.dragger.clearPreview()
	},

	onEnd: async (e: PointerEvent) => {
		const btn = e.currentTarget as HTMLElement
		dragState.delete(btn)

		btn.releasePointerCapture(e.pointerId)

		const reset = () => {
			btn.style.transition = ''
			btn.style.transform = ''
		}

		await meta.dragger.drop()
			reset()
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
