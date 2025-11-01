
import {Explorer} from "./explorer.js"
import {freshId} from "../../tools/fresh-id.js"
import {Id, BlueprintTree, Stock, Dock, Cell, Surface} from "../types.js"
import {clear_size_of_last_child, ensure_active_index_is_in_safe_range, get_active_surface, maintain_which_surface_is_active, movement_is_forward, movement_is_within_same_dock, same_place} from "./action-utils.js"

export class Actions {
	constructor(
		private tree: BlueprintTree,
		private stock: Stock,
	) {}

	/** peform a custom arbitrary mutation */
	async mutate<R>(fn: (explorer: Explorer, setRoot: (root: Cell) => void) => R) {
		let r: R
		await this.tree.mutate(state => {
			const explorer = new Explorer(() => state.root)
			r = fn(explorer, root => state.root = root)
		})
		return r!
	}

	async reset() {
		return this.mutate((_, setRoot) => {
			const root = this.stock.default()
			setRoot(root)
		})
	}

	async addSurface(dockId: Id, panel: string) {
		return this.mutate(explorer => {
			const dock = explorer.docks.require(dockId)
			const id = freshId()
			const surface: Surface = {id, kind: "surface", panel}
			dock.children.push(surface)
			const index = dock.children.indexOf(surface)
			return {surface, index}
		})
	}

	async activateSurface(surfaceId: Id) {
		return this.mutate(explorer => {
			const surface = explorer.surfaces.requireReport(surfaceId)
			const dock = explorer.surfaces.parent(surfaceId)
			dock.activeChildIndex = surface.index
		})
	}

	async setDockActiveSurface(dockId: Id, activeSurfaceIndex: number | null) {
		return this.mutate(explorer => {
			const dock = explorer.docks.require(dockId)
			dock.activeChildIndex = activeSurfaceIndex
		})
	}

	async resize(id: Id, size: number | null) {
		return this.mutate(explorer => {
			const node = explorer.all.require(id) as Cell | Dock
			node.size = size
		})
	}

	async deleteSurface(surfaceId: Id) {
		return this.mutate(explorer => {
			const {index} = explorer.surfaces.requireReport(surfaceId)
			const dock = explorer.surfaces.parent(surfaceId)
			dock.children.splice(index, 1)
			ensure_active_index_is_in_safe_range(dock)
		})
	}

	async deleteDock(id: Id) {
		return this.mutate((explorer, setRoot) => {
			const {index} = explorer.docks.requireReport(id)
			const cell = explorer.docks.parent(id)
			const grandparent = explorer.cells.parent(cell.id)

			cell.children.splice(index, 1)
			clear_size_of_last_child(cell)

			if (explorer.docks.nodes.length === 0)
				setRoot(this.stock.empty())

			else if (cell.children.length === 0) {
				const cellReport = explorer.cells.requireReport(cell.id)
				grandparent!.children.splice(cellReport.index, 1)
				clear_size_of_last_child(grandparent!)
			}

			else if (cell.children.length === 1) {
				const [onlyChild] = cell.children
				if (onlyChild.kind === "cell") {
					cell.children = onlyChild.children
					cell.vertical = onlyChild.vertical
				}
			}
		})
	}

	async splitDock(dockId: Id, vertical: boolean) {
		return this.mutate(explorer => {
			const {node: dock, index: dockIndex} = explorer.docks.requireReport(dockId)
			const parentCell = explorer.docks.parent(dockId)
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

				const newDock: Dock = {
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
				const newCell: Cell = {
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
		return this.mutate(explorer => {
			const {node: surface, index: sourceIndex} = explorer.surfaces.requireReport(surfaceId)
			const sourceDock = explorer.surfaces.parent(surfaceId)
			const destinationDock = explorer.docks.require(dockId)
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

