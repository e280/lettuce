
import {Cell, Dock} from "../../../../../layout/types.js"

export type ResizeOperation = {
	parent: Cell
	node: Cell | Dock
	next: null | {
		node: Cell | Dock
		initialSize: number | null
	}
	initialSize: number
	x: number
	y: number
	width: number
	height: number
}

