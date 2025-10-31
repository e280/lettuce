
import {renderCell} from "../cell.js"
import {renderDock} from "../dock.js"
import {renderSurface} from "../surface.js"
import {LayoutMeta} from "./layout-meta.js"
import {LayoutNode} from "../../../../../layout/types.js"

export function makeLayoutRenderer(
		draft: Omit<LayoutMeta, "renderLayout">,
	) {

	const meta: LayoutMeta = {...draft, renderLayout}

	function renderLayout(node: LayoutNode.Any) {
		switch (node.kind) {
			case "cell": return renderCell(meta)(node)
			case "dock": return renderDock(meta)(node)
			case "surface": return renderSurface(meta)(node)
			default: throw new Error(`unknown layout node kind`)
		}
	}

	return renderLayout
}

