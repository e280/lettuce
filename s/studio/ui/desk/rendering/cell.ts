
import {html} from "lit"

import {Cell} from "../../../../layout/types.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {alternator} from "../parts/alternator.js"
import {sizingStyles} from "../parts/sizing-styles.js"

export const renderCell =
	(meta: LayoutMeta) =>
	(cell: Cell) => html`

	<div
		class=cell
		?data-vertical=${cell.vertical}
		style="${sizingStyles(cell.size)}">

		${alternator(
			cell.children,
			child => meta.renderLayout(child),
			child => html`
				<div
					class=gutter
					@pointerdown=${meta.resizer.start(cell, child)}
				></div>
			`,
		)}
	</div>
`

