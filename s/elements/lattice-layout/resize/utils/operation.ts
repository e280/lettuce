
import {Layout} from "../../../../context/controllers/layout/parts/types.js"

export type ResizeOperation = {
	parent: Layout.Cell
	node: Layout.Cell | Layout.Pane
	next: null | {
		node: Layout.Cell | Layout.Pane
		initial_size: number | null
	}
	initial_size: number
	x: number
	y: number
	width: number
	height: number
}

