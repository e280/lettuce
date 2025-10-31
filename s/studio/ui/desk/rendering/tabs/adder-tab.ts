
import {html} from "lit"
import {LayoutMeta} from "../utils/layout-meta.js"
import {LayoutNode} from "../../../../../layout/types.js"
import {icon_feather_plus} from "../../../icons/groups/feather/plus.js"

export const AdderTab = ({meta, dock}: {
		meta: LayoutMeta
		dock: LayoutNode.Dock
	}) => {

	const active = dock.activeChildIndex === null
	const activate = () => meta
		.studio
		.layout
		.actions
		.setDockActiveSurface(dock.id, null)

	const show_drag_indicator = meta.dragger.isSurfaceIndicated(dock.id, dock.children.length)

	return html`
		<div class=tab>
			<div
				class=insert-indicator
				?data-drag=${show_drag_indicator}
			></div>

			<button
				data-adder
				title="add new tab"
				?data-active="${active}"
				@click=${activate}
				>

				<span class=icon>
					${icon_feather_plus}
				</span>

			</button>
		</div>
	`
}

