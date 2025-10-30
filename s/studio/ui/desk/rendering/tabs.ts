
import {html} from "lit"

import {AdderTab} from "./tabs/adder_tab.js"
import {PanelSpecs} from "../../../types.js"
import {LayoutMeta} from "./utils/layout_meta.js"
import {OrdinaryTab} from "./tabs/ordinary_tab.js"
import {LayoutNode} from "../../../../layout/types.js"

export const render_tabs = (
		panels: PanelSpecs,
		meta: LayoutMeta,
		pane: LayoutNode.Dock,
	) => html`

	${pane.children.map((leaf, leafIndex) => OrdinaryTab({
			panels,
			meta,
			pane,
			leaf,
			leafIndex,
		}))}

	${AdderTab({meta, dock: pane})}
`

