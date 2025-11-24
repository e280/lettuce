import {html, nothing} from 'lit'

import {clamp} from '../../../../../tools/numerical.js'
import {LayoutMeta} from '../utils/layout-meta.js'
import {Dock, Surface} from '../../../../../layout/types.js'
import {icon_feather_x} from '../../../icons/groups/feather/x.js'
import {containerRect, deepHitTest, getAxisBounds, getDockAxis, getOrigin, isPointerInside, outOfBoundsDistance} from '../../parts/drag-utils.js'

const DRAG_THRESHOLD = 3

const dragState = new WeakMap<HTMLElement, {
	id: number
	axis: 'x' | 'y'
	origin: {x: number, y: number}
	bounds: {min: number, max: number}
	lifted: boolean
}>()

const getDockTarget = (e: PointerEvent, ignored: HTMLElement) => {
	return deepHitTest({
		x: e.clientX,
		y: e.clientY,
		ignored,
		predicate: node => node.closest('[data-dock-id]')
	})
}

export const createDragHandlers = (meta: LayoutMeta, dock: Dock, surface: Surface) => ({
	onDown: (e: PointerEvent) => {
		if (e.button !== 0) return
		const target = e.target as HTMLElement
        if (target.closest('.x'))
        	return

		const btn = e.currentTarget as HTMLElement
		if (dragState.has(btn)) return

		const dockEl = btn.closest('[data-dock-id]')
		const tabs = dockEl?.querySelector('.tabs') as HTMLElement | null
		if (!tabs) return

		const axis = getDockAxis(dock)
		const c = tabs.getBoundingClientRect()
		const t = btn.getBoundingClientRect()

		dragState.set(btn, {
			id: e.pointerId,
			axis,
			lifted: false,
			origin: getOrigin(e),
			bounds: getAxisBounds(axis, c, t)
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
			btn.style.zIndex = '9999'
			btn.style.pointerEvents = 'none'

			const rect = btn.getBoundingClientRect()
			const size = s.axis === 'x' ? rect.width : rect.height

			meta.tabDragger.start(surface.id, size)
		}

		const tabsRect = (btn: HTMLElement) =>
			containerRect(btn.closest('.tabs'))

		const clampBounds = tabsRect(btn)
		let primaryInside = false

		if (clampBounds) {
			const inside = isPointerInside(e, clampBounds)
			const {dx: dxOut, dy: dyOut} = outOfBoundsDistance(e, clampBounds)
			const ESCAPE_MARGIN = 0

			primaryInside = inside || (dxOut < ESCAPE_MARGIN && dyOut < ESCAPE_MARGIN)
		}

		const primaryOffset = s.axis === 'x' ? dx : dy
		const oxLocked = s.axis === 'x' ? clamp(primaryOffset, s.bounds.min, s.bounds.max) : 0
		const oyLocked = s.axis === 'y' ? clamp(primaryOffset, s.bounds.min, s.bounds.max) : 0

		if (clampBounds && primaryInside) {
			btn.style.position = 'static'
			btn.style.transform = `translate(${oxLocked}px, ${oyLocked}px)`
		} else {
			btn.style.position = 'fixed'
			btn.style.transform = `translate(${dx}px, ${dy}px)`
		}

		const target = getDockTarget(e, btn) as HTMLElement
		if (target) {
			meta.tabDragger.preview(target, {x: e.clientX, y: e.clientY}, e)
		} else {
			meta.tabDragger.clearPreview()
		}
	},

	onEnd: async (e: PointerEvent) => {
		const btn = e.currentTarget as HTMLElement
		const tabs = btn.closest('.tabs') as HTMLElement | null

		dragState.delete(btn)

		const animatables = tabs
			? Array.from(tabs.querySelectorAll<HTMLElement>('.tab, button'))
			: []

		animatables.forEach(el => el.style.transition = 'none')

		await meta.tabDragger.drop()

		requestAnimationFrame(() => {
			btn.style.transform = ''
			btn.style.transition = ''
			btn.style.position = ''
			btn.style.zIndex = ''
			btn.style.pointerEvents = ''

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
	const isDragged = meta.tabDragger.isSurfaceDragging(surface.id)
	const handlers = createDragHandlers(meta, dock, surface)

	const close = () => meta.studio.layout.actions.deleteSurface(surface.id)
	const activate = () => meta.studio.layout.actions.setDockActiveSurface(dock.id, surfaceIndex)

	const click = (e: MouseEvent) => {
  			const target = e.target as HTMLElement
        const clickedX = target.closest('.x')

        if (!active) {
            activate()
            return
        }

        if (clickedX) {
            e.stopPropagation()
            close()
            return
        }

    }

	const draggedSize = meta.tabDragger.tabSize
	const shouldShift = draggedSize && meta.tabDragger.isDockIndicated(dock.id)

	return html`
		<div
			class=tab
			style="${shouldShift ? `--tab-shift-size: ${draggedSize}px` : nothing}"
			data-tab-for-surface=${surface.id}
			data-shift=${meta.tabDragger.calculateShift(dock.id, surfaceIndex, surface.id) ?? nothing}
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
				<span class=x ?data-available=${active}>
					${active ? icon_feather_x : nothing}
				</span>
			</button>
		</div>
	`
}
