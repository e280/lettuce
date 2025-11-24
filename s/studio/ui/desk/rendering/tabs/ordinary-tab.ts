import {html, nothing} from 'lit'

import {clamp} from '../../../../../tools/numerical.js'
import {LayoutMeta} from '../utils/layout-meta.js'
import {Dock, Surface} from '../../../../../layout/types.js'
import {icon_feather_x} from '../../../icons/groups/feather/x.js'
import {containerRect, deepHitTest, getAxisBounds, getDockAxis, getOrigin, isPointerInside, outOfBoundsDistance} from '../../parts/drag-utils.js'

const DRAG_THRESHOLD = 3

const getDockTarget = (e: PointerEvent, ignored: HTMLElement) => {
	return deepHitTest({
		x: e.clientX,
		y: e.clientY,
		ignored,
		predicate: node => node.closest('[data-dock-id]')
	})
}

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

	const handlers = {
		onDown: (e: PointerEvent) => {
			if (e.button !== 0)
				return

			const target = e.target as HTMLElement
			if (target.closest('.x'))
				return

			const btn = e.currentTarget as HTMLElement
			const dockEl = btn.closest('[data-dock-id]')
			const tabs = dockEl?.querySelector('.tabs')

			if (!tabs)
				return

			const axis = getDockAxis(dock)
			const c = tabs.getBoundingClientRect()
			const t = btn.getBoundingClientRect()

			btn.setPointerCapture(e.pointerId)
			const rect = btn.getBoundingClientRect()
			const tabSize = axis === 'x' ? rect.width : rect.height

			meta.tabDragger.start(surface.id, {
				axis,
				lifted: false,
				origin: getOrigin(e),
				bounds: getAxisBounds(axis, c, t),
				tabSize,
				clamped: true,
				position: {
					x: 0,
					y: 0
				}
			})
		},

		onMove: (e: PointerEvent) => {
			const btn = e.currentTarget as HTMLElement
			const drag = meta.tabDragger.dragState
			if (!drag) return

			const dx = e.clientX - drag.origin.x
			const dy = e.clientY - drag.origin.y

			if (!drag.lifted) {
				if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)
					return

				drag.lifted = true
			}

			const getTabsRect = (btn: HTMLElement) =>
				containerRect(btn.closest('.tabs'))

			const tabsRect = getTabsRect(btn)
			let primaryInside = false

			if (tabsRect) {
				const inside = isPointerInside(e, tabsRect)
				const {dx: dxOut, dy: dyOut} = outOfBoundsDistance(e, tabsRect)
				const ESCAPE_MARGIN = 0

				primaryInside = inside || (dxOut < ESCAPE_MARGIN && dyOut < ESCAPE_MARGIN)
			}

			const primaryOffset = drag.axis === 'x' ? dx : dy
			const oxLocked = drag.axis === 'x' ? clamp(primaryOffset, drag.bounds.min, drag.bounds.max) : 0
			const oyLocked = drag.axis === 'y' ? clamp(primaryOffset, drag.bounds.min, drag.bounds.max) : 0

			if (primaryInside) {
				meta.tabDragger.dragState = {
					...drag,
					clamped: true,
					position: {x: oxLocked, y: oyLocked}
				}
			} else {
				meta.tabDragger.dragState = {
					...drag,
					clamped: false,
					position: {x: dx, y: dy}
				}
			}

			const target = getDockTarget(e, btn)
			if (target) {
				meta.tabDragger.preview(target, {
					x: e.clientX, y: e.clientY
				}, e)
			} else {
				meta.tabDragger.clearPreview()
			}
		},

		onEnd: async (e: PointerEvent) => {
			const button = e.currentTarget as HTMLElement
			button.releasePointerCapture(e.pointerId)
			await meta.tabDragger.drop()
		}
	}

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

	const dragState = meta.tabDragger.dragState
	const position = dragState?.position
	const isDragged = meta.tabDragger.isSurfaceDragging(surface.id)
	const isClamped = meta.tabDragger.dragState?.clamped && isDragged
	const shouldShift = dragState?.tabSize && meta.tabDragger.isDockIndicated(dock.id)

	return html`
		<div
			class=tab
			style="${shouldShift ? `--tab-shift-size: ${dragState.tabSize}px;` : nothing}"
			data-tab-for-surface=${surface.id}
			data-shift=${meta.tabDragger.calculateShift(dock.id, surfaceIndex, surface.id) ?? nothing}
		>
			<button
				style="${isDragged ? `transform: translate(${position?.x}px, ${position?.y}px)` : nothing}"
				data-ordinary
				?data-clamped=${isClamped}
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
