
import {requirement} from "@benev/slate"

import {render_cell} from "../cell.js"
import {render_pane} from "../pane.js"
import {render_leaf} from "../leaf.js"
import {LayoutMeta} from "./layout_meta.js"
import {Layout} from "../../../../context/controllers/layout/parts/types.js"

export function make_layout_renderer(
		draft: Omit<LayoutMeta, "render_layout">,
	) {

	const meta: LayoutMeta = {...draft, render_layout}

	const render = requirement.provide(meta)({
		cell: render_cell,
		pane: render_pane,
		leaf: render_leaf,
	})

	function render_layout(node: Layout.Node) {
		switch (node.kind) {
			case "cell": return render.cell(node)
			case "pane": return render.pane(node)
			case "leaf": return render.leaf(node)
			default: throw new Error(`unknown layout node kind`)
		}
	}

	return render_layout
}

