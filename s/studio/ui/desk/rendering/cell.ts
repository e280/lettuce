
import {html} from "lit"

import {LayoutMeta} from "./utils/layout_meta.js"
import {alternator} from "../parts/alternator.js"
import {LayoutNode} from "../../../../layout/types.js"
import {sizing_styles} from "../parts/sizing_styles.js"

export const render_cell =
	(meta: LayoutMeta) =>
	(node: LayoutNode.Cell) => html`

	<div
		class=cell
		?data-vertical=${node.vertical}
		style="${sizing_styles(node.size)}">

		${alternator(
			node.children,
			(child) => meta.render_layout(child),
			(child, index) => html`
				<div
					class=resizer
					@pointerdown=${meta.resizer.start(node, child, index)}
				></div>
			`,
		)}
	</div>
`

