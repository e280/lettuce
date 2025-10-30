
import {Seeker} from "./seeker.js"
import {freshId} from "../../tools/fresh-id.js"
import {Id, LayoutNode, LayoutOptions, BlueprintTree} from "../types.js"
import {clear_size_of_last_child, ensure_active_index_is_in_safe_range, get_active_surface, maintain_which_surface_is_active, movement_is_forward, movement_is_within_same_dock, same_place} from "./action-utils.js"

export class Actions {
	constructor(
		private tree: BlueprintTree,
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

	async addSurface(dockId: Id, panel: string) {
		await this.#mut(seeker => {
			const [dock] = seeker.find<LayoutNode.Dock>(dockId)
			const id = freshId()
			const surface: LayoutNode.Surface = {id, kind: "surface", panel}
			dock.children.push(surface)
			return [surface, dock.children.indexOf(surface)] as [LayoutNode.Surface, number]
		})
	}

	async setDockActiveSurface(dockId: Id, activeSurfaceIndex: number | null) {
		await this.#mut(seeker => {
			const [dock] = seeker.find<LayoutNode.Dock>(dockId)
			dock.activeChildIndex = activeSurfaceIndex
		})
	}

	async resize(id: Id, size: number | null) {
		await this.#mut(seeker => {
			const [node] = seeker.find<LayoutNode.Cell | LayoutNode.Dock>(id)
			node.size = size
		})
	}

	async deleteSurface(id: Id) {
		await this.#mut(seeker => {
			const [, parentDock, surfaceIndex] = seeker.find<LayoutNode.Surface>(id)
			parentDock.children.splice(surfaceIndex, 1)
			ensure_active_index_is_in_safe_range(parentDock)
		})
	}

	async deleteDock(id: Id) {
		await this.#mut((seeker, setRoot) => {
			const [, parentCell, dockIndex] = seeker.find<LayoutNode.Dock>(id)
			const [, grandparentCell, parentCellIndex] = seeker.find<LayoutNode.Cell>(parentCell.id)

			parentCell.children.splice(dockIndex, 1)
			clear_size_of_last_child(parentCell)

			if (seeker.docks.length === 0)
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

	async splitDock(id: Id, vertical: boolean) {
		await this.#mut(seeker => {
			const [dock, parentCell, dockIndex] = seeker.find<LayoutNode.Dock>(id)
			const previousSize = dock.size

			if (parentCell.vertical === vertical) {
				let newSize: null | number

				if (previousSize) {
					const half = previousSize / 2
					dock.size = half
					newSize = half
				}
				else {
					const x = (
						parentCell
							.children
							.reduce((previous, current) =>
								previous + (current.size ?? 0), 0)
					)
					dock.size = (100 - x) / 2
					newSize = null
				}

				const newDock: LayoutNode.Dock = {
					id: freshId(),
					kind: "dock",
					children: [],
					activeChildIndex: null,
					size: newSize,
				}

				parentCell.children.splice(dockIndex + 1, 0, newDock)
			}
			else {
				dock.size = 50
				const newCell: LayoutNode.Cell = {
					id: freshId(),
					kind: "cell",
					size: previousSize,
					vertical,
					children: [dock, {
						id: freshId(),
						kind: "dock",
						size: null,
						children: [],
						activeChildIndex: null,
					}],
				}
				parentCell.children.splice(dockIndex, 1, newCell)
			}
		})
	}

	async moveSurface(
			surfaceId: Id,
			dockId: Id,
			destinationIndex: number,
		) {
		await this.#mut(seeker => {
			const [surface, sourceDock, sourceIndex] = seeker.find<LayoutNode.Surface>(surfaceId)
			const [destinationDock] = seeker.find<LayoutNode.Dock>(dockId)
			const surfaceIsActive = surface === get_active_surface(sourceDock)

			const delete_at_source = () =>
				sourceDock.children.splice(sourceIndex, 1)

			const insert_at_destination = () =>
				destinationDock.children.splice(destinationIndex, 0, surface)

			if (movement_is_within_same_dock(sourceDock, destinationDock)) {
				if (!same_place(sourceIndex, destinationIndex))
					maintain_which_surface_is_active(sourceDock, () => {
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
				if (surfaceIsActive) {
					insert_at_destination()
					destinationDock.activeChildIndex = destinationIndex
				}
				else {
					maintain_which_surface_is_active(destinationDock, () => {
						insert_at_destination()
					})
				}
				maintain_which_surface_is_active(sourceDock, () => {
					delete_at_source()
				})
			}
		})
	}
}

