
import {html} from "@benev/slate"

import {LayoutMeta} from "../utils/layout_meta.js"
import {Salad} from "../../../../context/salad.js"
import {icon_feather_x} from "../../../../icons/groups/feather/x.js"
import {Layout} from "../../../../context/controllers/layout/parts/types.js"

const inside_x_button = (event: MouseEvent) => {
	const target = event.target as Element
	const tab = event.currentTarget as HTMLElement
	const x = tab.querySelector(".x") as HTMLElement
	return event.target === x || x.contains(target)
}

export const OrdinaryTab = Salad.nexus.lightView(use => ({
		meta, pane, leaf, leafIndex,
	}: {
		meta: LayoutMeta
		pane: Layout.Pane
		leaf: Layout.Leaf
		leafIndex: number
	}) => {

	const {icon, label} = use.context.panels[leaf.panel]
	const active = pane.active_leaf_index === leafIndex
	const show_drag_indicator = meta.dragger.is_leaf_indicated(pane.id, leafIndex)

	const close = () => meta
		.layout
		.actions
		.delete_leaf(leaf.id)

	const activate = () => meta
		.layout
		.actions
		.set_pane_active_leaf(pane.id, leafIndex)

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
})

