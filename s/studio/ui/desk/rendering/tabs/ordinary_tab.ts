
import {html} from "lit"
import {PanelSpecs} from "../../../../types.js"
import {LayoutMeta} from "../utils/layout_meta.js"
import {LayoutNode} from "../../../../../layout/types.js"
import {icon_feather_x} from "../../../icons/groups/feather/x.js"

const inside_x_button = (event: MouseEvent) => {
	const target = event.target as Element
	const tab = event.currentTarget as HTMLElement
	const x = tab.querySelector(".x") as HTMLElement
	return event.target === x || x.contains(target)
}

export const OrdinaryTab = ({
		panels, meta, pane, leaf, leafIndex,
	}: {
		panels: PanelSpecs
		meta: LayoutMeta
		pane: LayoutNode.Dock
		leaf: LayoutNode.Surface
		leafIndex: number
	}) => {

	const {icon, label} = panels[leaf.panel]
	const active = pane.activeChildIndex === leafIndex
	const show_drag_indicator = meta.dragger.is_leaf_indicated(pane.id, leafIndex)

	const close = () => meta
		.layout
		.actions
		.deleteSurface(leaf.id)

	const activate = () => meta
		.layout
		.actions
		.setDockActiveSurface(pane.id, leafIndex)

	const click = (event: MouseEvent) => {
		if (!active) {
			activate()
			return
		}
		if (inside_x_button(event))
			close()
	}

	return html`
		<div class=tab data-tab-for-leaf="${leaf.id}">
			<div
				class=insert-indicator
				?data-drag=${show_drag_indicator}
			></div>

			<button
				data-ordinary
				title="${label}"
				?data-active=${active}
				@click=${click}

				draggable=true
				@dragstart=${meta.dragger.tab.start(leaf.id)}
				>

				<span class=icon>
					${icon()}
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

