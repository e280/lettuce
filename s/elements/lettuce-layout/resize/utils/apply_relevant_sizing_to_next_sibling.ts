
import {ResizeOperation} from "./operation.js"
import {cap_percent} from "../../../../tools/number_functions.js"
import {LayoutActions} from "../../../../context/controllers/layout/parts/actions.js"

export function apply_relevant_sizing_to_next_sibling(
		actions: LayoutActions,
		resize: ResizeOperation,
		new_size_of_current_cell: number,
	) {

	if (
			resize.next &&
			resize.next.initial_size !== null &&
			resize.next.node.size !== null
		) {

		actions.resize(
			resize.next.node.id,
			cap_percent(
				resize.next.initial_size + (resize.initial_size - new_size_of_current_cell)
			)
		)
	}
}

