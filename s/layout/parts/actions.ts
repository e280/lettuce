
import {Lens} from "@e280/strata"
import {Explorer} from "./explorer.js"
import {freshId} from "../../tools/fresh-id.js"
import {Id, Stock, Dock, Cell, Surface, Blueprint} from "../types.js"
import {ensure_active_index_is_in_safe_range, get_active_surface, maintain_which_surface_is_active, movement_is_forward, movement_is_within_same_dock, redistribute_child_sizes_naively, same_place} from "./action-utils.js"
import { clamp } from "../../tools/numerical.js"

export class Actions {
	constructor(
		private lens: Lens<Blueprint>,
		private stock: Stock,
	) {}

	/** peform a custom arbitrary mutation */
	async mutate<R>(fn: (explorer: Explorer, setRoot: (root: Cell) => void) => R) {
		let r: R
		await this.lens.mutate(state => {
			const explorer = new Explorer(() => state.root)
			r = fn(explorer, root => state.root = root)
		})
		return r!
	}

	async reset(root = this.stock.default()) {
		return this.mutate((_, setRoot) => {
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

	async resize(id: Id, size: number) {
		return this.mutate(explorer => {
			const node = explorer.all.require(id)
			if (node.kind === "surface") throw new Error("cannot resize surface (only cells and docks can be resized)")
			const parent = explorer.all.parent(id) as Cell | undefined
			if (!parent) throw new Error("cannot resize root cell")
			const index = parent.children.findIndex(n => n.id === id)
			const next = parent.children.at(index + 1)

			const initialSize = size
			node.size = clamp(size)

			if (next) {
				const delta = node.size - initialSize
				next.size = clamp(next.size - delta)
			}

			// TODO

			// const report = explorer.all.requireReport(id)
			// if (report.node.kind === "surface") throw new Error("cannot resize a surface node")
			// const [parent] = report

			// const node = explorer.all.require(id) as Cell | Dock
			// node.size = size
			//
			// const next = node.children.at(index + 1)
			//
			//
			// if (
			// 		resize.next &&
			// 		resize.next.initialSize !== null &&
			// 		resize.next.node.size !== null
			// 	) {
			//
			// 	layout.actions.resize(
			// 		resize.next.node.id,
			// 		capPercent(
			// 			resize.next.initialSize + (resize.initialSize - new_size_of_current_cell)
			// 		)
			// 	)
			// }
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

			cell.children.splice(index, 1)
			// // TODO
			// clear_size_of_last_child(grandparent!)
			redistribute_child_sizes_naively(cell)

			if (explorer.docks.nodes.length === 0)
				setRoot(this.stock.empty())

			else if (cell.children.length === 0) {
				const grandparent = explorer.cells.parent(cell.id)!
				const cellReport = explorer.cells.requireReport(cell.id)
				grandparent.children.splice(cellReport.index, 1)
				// // TODO
				// clear_size_of_last_child(grandparent!)
				redistribute_child_sizes_naively(grandparent)
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
				let newSize: number = previousSize / 2

				// // TODO
				// if (previousSize) {
					const half = previousSize / 2
					dock.size = half
					newSize = half
				// }
				// else {
				// 	const x = (
				// 		parentCell
				// 			.children
				// 			.reduce((previous, current) =>
				// 				previous + (current.size ?? 0), 0)
				// 	)
				// 	dock.size = (100 - x) / 2
				// 	newSize = null
				// }

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
						size: 100,
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

