
import {html} from "lit"
import {AdderTab} from "./tabs/adder-tab.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {OrdinaryTab} from "./tabs/ordinary-tab.js"
import {LayoutNode} from "../../../../layout/types.js"

export const renderTabs = (
		meta: LayoutMeta,
		dock: LayoutNode.Dock,
	) => html`

	${dock.children.map((leaf, leafIndex) => OrdinaryTab({
			meta,
			dock: dock,
			surface: leaf,
			surfaceIndex: leafIndex,
		}))}

	${AdderTab({meta, dock: dock})}
`

