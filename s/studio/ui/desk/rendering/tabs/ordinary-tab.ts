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

const getDockTarget = (e: PointerEvent, ignored: HTMLElement) => {
	const x = e.clientX
	const y = e.clientY

	const stack = document.elementsFromPoint(x, y)
	let node = stack.find(el => el !== ignored && !ignored.contains(el)) as HTMLElement | undefined
	if (!node) return null

	const visited = new Set<HTMLElement>()

	while (node) {
		if (visited.has(node)) break
		visited.add(node)

		const dock = node.closest?.('[data-dock-id]') as HTMLElement | null
		if (dock) return dock

		const root = node.shadowRoot
		if (!root) break

		const deeper = root.elementFromPoint(x, y) as HTMLElement | null
		if (!deeper || deeper === node || deeper === ignored) break

		node = deeper
	}

	const root = node?.getRootNode()
	if (root instanceof ShadowRoot) {
		const hostDock = (root.host as HTMLElement).closest('[data-dock-id]')
		if (hostDock) return hostDock
	}

	return null
}

const getAxis = (dock: Dock) =>
	(dock.taskbarAlignment === 'left' || dock.taskbarAlignment === 'right')
		? 'y'
		: 'x'

const getOrigin = (e: PointerEvent) => ({
	x: e.clientX,
	y: e.clientY
})

const getBounds = (axis: 'x' | 'y', container: DOMRect, tab: DOMRect) =>
	axis === 'x'
		? {min: container.left - tab.left, max: container.right - tab.right}
		: {min: container.top - tab.top, max: container.bottom - tab.bottom}

const getClampBounds = (btn: HTMLElement) => {
	const tabs = btn.closest('.tabs') as HTMLElement | null
	return tabs ? tabs.getBoundingClientRect() : null
}

const isInside = (e: PointerEvent, rect: DOMRect) =>
	e.clientX >= rect.left &&
	e.clientX <= rect.right &&
	e.clientY >= rect.top &&
	e.clientY <= rect.bottom

const escapeDistance = (e: PointerEvent, r: DOMRect) => {
	const dx =
		e.clientX < r.left ? r.left - e.clientX :
		e.clientX > r.right ? e.clientX - r.right :
		0

	const dy =
		e.clientY < r.top ? r.top - e.clientY :
		e.clientY > r.bottom ? e.clientY - r.bottom :
		0

	return {dx, dy}
}

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
			btn.style.zIndex = '9999'
			btn.style.pointerEvents = 'none'

			const rect = btn.getBoundingClientRect()
			const size = s.axis === 'x' ? rect.width : rect.height

			meta.dragger.start(surface.id, size)
		}

		const clampBounds = getClampBounds(btn)
		let primaryInside = false

		if (clampBounds) {
			const inside = isInside(e, clampBounds)
			const {dx: dxOut, dy: dyOut} = escapeDistance(e, clampBounds)
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
			meta.dragger.preview(target, {x: e.clientX, y: e.clientY}, e)
		} else {
			meta.dragger.clearPreview()
		}
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
	const isDragged = meta.dragger.isSurfaceDragging(surface.id)
	const handlers = createDragHandlers(meta, dock, surface)

	const insideX = (e: MouseEvent) => {
		const tab = e.currentTarget as HTMLElement
		const x = tab.querySelector('.x') as HTMLElement
		return e.target === x || x.contains(e.target as Node)
	}

	const close = () => meta.studio.layout.actions.deleteSurface(surface.id)
	const activate = () => meta.studio.layout.actions.setDockActiveSurface(dock.id, surfaceIndex)

	const click = (e: MouseEvent) => {
		if (!active) return activate()
		if (insideX(e)) close()
	}

	const draggedSize = meta.dragger.tabSize
	const shouldShift = draggedSize && meta.dragger.isDockIndicated(dock.id)

	return html`
		<div
			class=tab
			style="${shouldShift ? `--tab-shift-size: ${draggedSize}px` : nothing}"
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
				<span class=x ?data-available=${active}>
					${active ? icon_feather_x : nothing}
				</span>
			</button>
		</div>
	`
}
