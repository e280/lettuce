
import {Layout} from "../types.js"

export function movement_is_within_same_pane(
		source_pane: Layout.Pane,
		destination_pane: Layout.Pane,
	) {
	return source_pane === destination_pane
}

export function same_place(
		source_index: number,
		destination_index: number,
	) {
	return (
		source_index === destination_index ||
		source_index === (destination_index - 1)
	)
}

export function movement_is_forward(
		source_index: number,
		destination_index: number,
	) {
	return source_index < destination_index
}

export function get_active_leaf(pane: Layout.Pane) {
	return pane.active_leaf_index !== null
		? pane.children[pane.active_leaf_index]
		: null
}

export function maintain_which_leaf_is_active(pane: Layout.Pane, fun: () => void) {
	const reapply = remember_which_leaf_is_active(pane)
	fun()
	reapply()
}

export function remember_which_leaf_is_active(pane: Layout.Pane) {
	const original_index = pane.active_leaf_index
	const active_leaf_id = get_active_leaf(pane)?.id

	return () => {
		if (active_leaf_id === null)
			pane.active_leaf_index = null
		else {
			const new_index = pane.children
				.findIndex(leaf => leaf.id === active_leaf_id)
			pane.active_leaf_index = (new_index === -1)
				? original_index
				: new_index
			ensure_active_index_is_in_safe_range(pane)
		}
	}
}

export function parent(path: number[]) {
	return path.slice(0, path.length - 1)
}

export function clear_size_of_last_child(node: Layout.Cell) {
	const last = node.children.at(-1)
	if (last)
		last.size = null
}

export function ensure_active_index_is_in_safe_range(pane: Layout.Pane) {
	pane.active_leaf_index = pane.active_leaf_index === null
		? null
		: pane.active_leaf_index > (pane.children.length - 1)
			? null
			: pane.active_leaf_index
}

