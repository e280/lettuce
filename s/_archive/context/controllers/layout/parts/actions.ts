
import {StateTree} from "@benev/slate"

import {Layout} from "./types.js"
import {LayoutSeeker} from "./seeker.js"
import {StockLayouts} from "./utils/stock_layouts.js"
import {Id, freshId} from "../../../../tools/fresh_id.js"
import {clear_size_of_last_child, ensure_active_index_is_in_safe_range, get_active_leaf, maintain_which_leaf_is_active, movement_is_forward, movement_is_within_same_pane, same_place} from "./utils/helpers.js"

export type LayoutActions = ReturnType<typeof prepare_layout_actions>

export function prepare_layout_actions(
		tree: StateTree<Layout.Cell>,
		stock_layouts: StockLayouts,
	) {

	function action<P extends any[], R>(
			fun: (
				seeker: LayoutSeeker,
				setRoot: (root: Layout.Cell) => void,
			) => (...p: P) => R
		) {

		return (...p: P) => {
			let result: R = undefined as any

			tree.transmute(root => {
				const setRoot = (newRoot: Layout.Cell) => {
					root = newRoot
				}
				result = fun(new LayoutSeeker(() => root), setRoot)(...p)
				return root
			})

			return result
		}
	}

	return {
		split_pane: action(seeker => (id: Id, vertical: boolean) => {
			const [pane, parent_cell, pane_index] = seeker.find<Layout.Pane>(id)
			const previous_size = pane.size

			if (parent_cell.vertical === vertical) {
				let new_size: null | number

				if (previous_size) {
					const half = previous_size / 2
					pane.size = half
					new_size = half
				}
				else {
					const x = (
						parent_cell
							.children
							.reduce((previous, current) =>
								previous + (current.size ?? 0), 0)
					)
					pane.size = (100 - x) / 2
					new_size = null
				}

				const new_pane: Layout.Pane = {
					id: freshId(),
					kind: "pane",
					children: [],
					active_leaf_index: null,
					size: new_size,
				}

				parent_cell.children.splice(pane_index + 1, 0, new_pane)
			}
			else {
				pane.size = 50
				const new_cell: Layout.Cell = {
					id: freshId(),
					kind: "cell",
					size: previous_size,
					vertical,
					children: [pane, {
						id: freshId(),
						kind: "pane",
						size: null,
						children: [],
						active_leaf_index: null,
					}],
				}
				parent_cell.children.splice(pane_index, 1, new_cell)
			}
		}),

		delete_pane: action((seeker, setRoot) => (id: Id) => {
			const [,parent_cell, pane_index] = seeker.find<Layout.Pane>(id)
			const [,grandparent_cell, parent_cell_index] = seeker.find<Layout.Cell>(parent_cell.id)

			parent_cell.children.splice(pane_index, 1)
			clear_size_of_last_child(parent_cell)

			if (seeker.panes.length === 0)
				setRoot(stock_layouts.empty())

			else if (parent_cell.children.length === 0) {
				grandparent_cell!.children.splice(parent_cell_index, 1)
				clear_size_of_last_child(grandparent_cell!)
			}

			else if (parent_cell.children.length === 1) {
				const [only_child] = parent_cell.children
				if (only_child.kind === "cell") {
					parent_cell.children = only_child.children
					parent_cell.vertical = only_child.vertical
				}
			}
		}),

		delete_leaf: action(seeker => (id: Id) => {
			const [,parent_pane, leaf_index] = seeker.find<Layout.Leaf>(id)
			parent_pane.children.splice(leaf_index, 1)
			ensure_active_index_is_in_safe_range(parent_pane)
		}),

		move_leaf: action(seeker => (
				leafId: Id,
				paneId: Id,
				destination_index: number,
			) => {

			const [leaf, source_pane, source_index] = seeker.find<Layout.Leaf>(leafId)
			const [destination_pane] = seeker.find<Layout.Pane>(paneId)
			const leaf_is_active = leaf === get_active_leaf(source_pane)

			const delete_at_source = () =>
				source_pane.children.splice(source_index, 1)

			const insert_at_destination = () =>
				destination_pane.children.splice(destination_index, 0, leaf)

			if (movement_is_within_same_pane(source_pane, destination_pane)) {
				if (!same_place(source_index, destination_index))
					maintain_which_leaf_is_active(source_pane, () => {
						if (movement_is_forward(source_index, destination_index)) {
							insert_at_destination()
							delete_at_source()
						}
						else {
							delete_at_source()
							insert_at_destination()
						}
					})
			}
			else {
				if (leaf_is_active) {
					insert_at_destination()
					destination_pane.active_leaf_index = destination_index
				}
				else {
					maintain_which_leaf_is_active(destination_pane, () => {
						insert_at_destination()
					})
				}
				maintain_which_leaf_is_active(source_pane, () => {
					delete_at_source()
				})
			}
		}),

		add_leaf: action(seeker => (
				paneId: Id,
				panel: string,
			) => {
			const [pane] = seeker.find<Layout.Pane>(paneId)
			const id = freshId()
			const leaf: Layout.Leaf = {id, kind: "leaf", panel}
			pane.children.push(leaf)
			return [leaf, pane.children.indexOf(leaf)] as [Layout.Leaf, number]
		}),

		set_pane_active_leaf: action(seeker => (
				paneId: Id,
				active_leaf_index: number | null
			) => {
			const [pane] = seeker.find<Layout.Pane>(paneId)
			pane.active_leaf_index = active_leaf_index
		}),

		resize: action(seeker => (id: Id, size: number | null) => {
			const [node] = seeker.find<Layout.Cell | Layout.Pane>(id)
			node.size = size
		}),
	}
}

