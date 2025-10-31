
import {html} from "lit"

import {LayoutMeta} from "./utils/layout-meta.js"
import {alternator} from "../parts/alternator.js"
import {LayoutNode} from "../../../../layout/types.js"
import {sizingStyles} from "../parts/sizing-styles.js"

export const renderCell =
	(meta: LayoutMeta) =>
	(cell: LayoutNode.Cell) => html`

	<div
		class=cell
		?data-vertical=${cell.vertical}
		style="${sizingStyles(cell.size)}">

		${alternator(
			cell.children,
			(child) => meta.renderLayout(child),
			(child, index) => html`
				<div
					class=resizer
					@pointerdown=${meta.resizer.start(cell, child, index)}
				></div>
			`,
		)}
	</div>
`

