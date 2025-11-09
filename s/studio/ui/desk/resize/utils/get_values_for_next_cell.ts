
import {ResizeOperation} from "./operation.js"

export function get_values_for_next_cell(resize: ResizeOperation) {
	if (
		resize.next &&
		resize.next.initialSize !== undefined &&
		resize.next.node.size !== undefined
	) {
		return {
			initial_size: resize.next.initialSize,
			size: resize.next.node.size,
		}
	}
}

