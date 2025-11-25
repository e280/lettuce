import {html, nothing} from 'lit'

import {LayoutMeta} from '../utils/layout-meta.js'
import {Dock, Surface} from '../../../../../layout/types.js'
import {icon_feather_x} from '../../../icons/groups/feather/x.js'
import {getAxisBounds, getDockAxis, getOrigin} from '../../parts/drag-utils.js'

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

			click(e)
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
		onEnd: async () => {
			await meta.tabDragger.drop()
		}
	}

	const close = () => meta.studio.layout.actions.deleteSurface(surface.id)
	const activate = () => meta.studio.layout.actions.activateSurface(surface.id)

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
			part=tab
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
				@pointerdown=${handlers.onDown}
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

