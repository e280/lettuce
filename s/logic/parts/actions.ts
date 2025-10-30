
import {Seeker} from "./seeker.js"
import {freshId} from "../../tools/fresh-id.js"
import {Id, LayoutNode, LayoutOptions, LayoutTree} from "../types.js"
import {clear_size_of_last_child, ensure_active_index_is_in_safe_range, get_active_leaf, maintain_which_leaf_is_active, movement_is_forward, movement_is_within_same_pane, same_place} from "./action-utils.js"

export class Actions {
	constructor(
		private tree: LayoutTree,
		private options: LayoutOptions<any>,
	) {}

	async reset() {
		const root = this.options.stock.default()
		await this.tree.mutate(state => state.root = root)
	}

	async #mut(fn: (seeker: Seeker, setRoot: (root: LayoutNode.Cell) => void) => void) {
		await this.tree.mutate(state => {
			const seeker = new Seeker(() => state.root)
			fn(seeker, root => state.root = root)
		})
	}

	async addLeaf(paneId: Id, panel: string) {
		await this.#mut(seeker => {
			const [pane] = seeker.find<LayoutNode.Pane>(paneId)
			const id = freshId()
			const leaf: LayoutNode.Leaf = {id, kind: "leaf", panel}
			pane.children.push(leaf)
			return [leaf, pane.children.indexOf(leaf)] as [LayoutNode.Leaf, number]
		})
	}

	async setPaneActiveLeaf(paneId: Id, activeLeafIndex: number | null) {
		await this.#mut(seeker => {
			const [pane] = seeker.find<LayoutNode.Pane>(paneId)
			pane.active_leaf_index = activeLeafIndex
		})
	}

	async resize(id: Id, size: number | null) {
		await this.#mut(seeker => {
			const [node] = seeker.find<LayoutNode.Cell | LayoutNode.Pane>(id)
			node.size = size
		})
	}

	async deleteLeaf(id: Id) {
		await this.#mut(seeker => {
			const [, parentPane, leafIndex] = seeker.find<LayoutNode.Leaf>(id)
			parentPane.children.splice(leafIndex, 1)
			ensure_active_index_is_in_safe_range(parentPane)
		})
	}

	async deletePane(id: Id) {
		await this.#mut((seeker, setRoot) => {
			const [, parentCell, paneIndex] = seeker.find<LayoutNode.Pane>(id)
			const [, grandparentCell, parentCellIndex] = seeker.find<LayoutNode.Cell>(parentCell.id)

			parentCell.children.splice(paneIndex, 1)
			clear_size_of_last_child(parentCell)

			if (seeker.panes.length === 0)
				setRoot(this.options.stock.empty())

			else if (parentCell.children.length === 0) {
				grandparentCell!.children.splice(parentCellIndex, 1)
				clear_size_of_last_child(grandparentCell!)
			}

			else if (parentCell.children.length === 1) {
				const [onlyChild] = parentCell.children
				if (onlyChild.kind === "cell") {
					parentCell.children = onlyChild.children
					parentCell.vertical = onlyChild.vertical
				}
			}
		})
	}

	async splitPane(id: Id, vertical: boolean) {
		await this.#mut(seeker => {
			const [pane, parentCell, paneIndex] = seeker.find<LayoutNode.Pane>(id)
			const previousSize = pane.size

			if (parentCell.vertical === vertical) {
				let new_size: null | number

				if (previousSize) {
					const half = previousSize / 2
					pane.size = half
					new_size = half
				}
				else {
					const x = (
						parentCell
							.children
							.reduce((previous, current) =>
								previous + (current.size ?? 0), 0)
					)
					pane.size = (100 - x) / 2
					new_size = null
				}

				const newPane: LayoutNode.Pane = {
					id: freshId(),
					kind: "pane",
					children: [],
					active_leaf_index: null,
					size: new_size,
				}

				parentCell.children.splice(paneIndex + 1, 0, newPane)
			}
			else {
				pane.size = 50
				const newCell: LayoutNode.Cell = {
					id: freshId(),
					kind: "cell",
					size: previousSize,
					vertical,
					children: [pane, {
						id: freshId(),
						kind: "pane",
						size: null,
						children: [],
						active_leaf_index: null,
					}],
				}
				parentCell.children.splice(paneIndex, 1, newCell)
			}
		})
	}

	async moveLeaf(
			leafId: Id,
			paneId: Id,
			destinationIndex: number,
		) {
		await this.#mut(seeker => {
			const [leaf, sourcePane, sourceIndex] = seeker.find<LayoutNode.Leaf>(leafId)
			const [destinationPane] = seeker.find<LayoutNode.Pane>(paneId)
			const leafIsActive = leaf === get_active_leaf(sourcePane)

			const delete_at_source = () =>
				sourcePane.children.splice(sourceIndex, 1)

			const insert_at_destination = () =>
				destinationPane.children.splice(destinationIndex, 0, leaf)

			if (movement_is_within_same_pane(sourcePane, destinationPane)) {
				if (!same_place(sourceIndex, destinationIndex))
					maintain_which_leaf_is_active(sourcePane, () => {
						if (movement_is_forward(sourceIndex, destinationIndex)) {
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
				if (leafIsActive) {
					insert_at_destination()
					destinationPane.active_leaf_index = destinationIndex
				}
				else {
					maintain_which_leaf_is_active(destinationPane, () => {
						insert_at_destination()
					})
				}
				maintain_which_leaf_is_active(sourcePane, () => {
					delete_at_source()
				})
			}
		})
	}
}

