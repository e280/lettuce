
import {html} from "@benev/slate"

import {LayoutMeta} from "../utils/layout_meta.js"
import {Lettuce} from "../../../../context/lettuce-rofl.js"
import {icon_feather_plus} from "../../../../icons/groups/feather/plus.js"
import {Layout} from "../../../../context/controllers/layout/parts/types.js"

export const AdderTab = Lettuce.nexus.lightView(_ => ({meta, pane}: {
		meta: LayoutMeta
		pane: Layout.Pane
	}) => {

	const active = pane.active_leaf_index === null
	const activate = () => meta
		.layout
		.actions
		.set_pane_active_leaf(pane.id, null)

	const show_drag_indicator = meta.dragger.is_leaf_indicated(pane.id, pane.children.length)

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
})

