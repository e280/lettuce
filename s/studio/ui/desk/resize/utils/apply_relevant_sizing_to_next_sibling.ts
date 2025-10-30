
import {ResizeOperation} from "./operation.js"
import {Layout} from "../../../../../layout/layout.js"
import {capPercent} from "../../../../../tools/numerical.js"

export function apply_relevant_sizing_to_next_sibling(
		layout: Layout,
		resize: ResizeOperation,
		new_size_of_current_cell: number,
	) {

	if (
			resize.next &&
			resize.next.initial_size !== null &&
			resize.next.node.size !== null
		) {

		layout.actions.resize(
			resize.next.node.id,
			capPercent(
				resize.next.initial_size + (resize.initial_size - new_size_of_current_cell)
			)
		)
	}
}

