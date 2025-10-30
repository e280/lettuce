
import {LayoutNode} from "../../../../../layout/types.js"

export type ResizeOperation = {
	parent: LayoutNode.Cell
	node: LayoutNode.Cell | LayoutNode.Dock
	next: null | {
		node: LayoutNode.Cell | LayoutNode.Dock
		initial_size: number | null
	}
	initial_size: number
	x: number
	y: number
	width: number
	height: number
}

