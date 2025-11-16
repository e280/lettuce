
import {html} from "lit"
import {LayoutMeta} from "../utils/layout-meta.js"
import {Dock, Surface} from "../../../../../layout/types.js"
import {icon_feather_x} from "../../../icons/groups/feather/x.js"

const insideXButton = (event: MouseEvent) => {
	const target = event.target as Element
	const tab = event.currentTarget as HTMLElement
	const x = tab.querySelector(".x") as HTMLElement
	return event.target === x || x.contains(target)
}

export const OrdinaryTab = ({
		meta, dock, surface, surfaceIndex,
	}: {
		meta: LayoutMeta
		dock: Dock
		surface: Surface
		surfaceIndex: number
	}) => {

	const {icon, label} = meta.studio.panels[surface.panel]
	const active = dock.activeChildIndex === surfaceIndex
	const show_drag_indicator = meta.dragger.isSurfaceIndicated(dock.id, surfaceIndex)

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
		<div class=tab data-tab-for-surface="${surface.id}">
			<div class=insert-indicator ?data-drag="${show_drag_indicator}"></div>

			<button
				data-ordinary
				title="${label}"
				?data-active=${active}
				@click=${click}

				draggable=true
				@dragstart="${meta.dragger.tab.start(surface.id)}">

				<span class=icon>
					${icon({studio: meta.studio, dock})}
				</span>

				<span class=x ?data-available=${active}>
					${active
						? icon_feather_x
						: undefined}
				</span>
			</button>
		</div>
	`
}

