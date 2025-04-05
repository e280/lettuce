
import {html} from "lit"

import {AdderTab} from "./tabs/adder_tab.js"
import {LayoutMeta} from "./utils/layout_meta.js"
import {OrdinaryTab} from "./tabs/ordinary_tab.js"
import {Layout} from "../../../context/controllers/layout/parts/types.js"

export const render_tabs = (
		meta: LayoutMeta,
		pane: Layout.Pane,
	) => html`

	${pane.children.map((leaf, leafIndex) => OrdinaryTab({
			meta,
			pane,
			leaf,
			leafIndex,
		}))}

	${AdderTab({meta, pane})}
`

