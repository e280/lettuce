
import {signal, SignalFn} from "@e280/strata"
import {isWithin} from "./drag-utils.js"
import {Id} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"
import {Actions} from "../../../../layout/parts/actions.js"
import {Explorer} from "../../../../layout/parts/explorer.js"

export type TabDragOperation = {
	surfaceId: Id
	proposedDestination: null | {
		dockId: Id
		surfaceIndex: number
	}
}

export class TabDragger {
	#operation: SignalFn<TabDragOperation | undefined>
	#explorer: Explorer
	#actions: Actions

	constructor(layout: Layout) {
		this.#explorer = layout.explorer
		this.#actions = layout.actions
		this.#operation = signal<TabDragOperation | undefined>(undefined)
	}

	isSurfaceIndicated(dockId: Id, surfaceIndex: number) {
		const operation = this.#operation.value
		return (
			operation &&
			operation.proposedDestination &&
			operation.proposedDestination.dockId === dockId &&
			operation.proposedDestination.surfaceIndex === surfaceIndex
		)
	}

	isDockIndicated(dockId: Id) {
		const operation = this.#operation.value
		return (
			operation &&
			operation.proposedDestination &&
			operation.proposedDestination.dockId === dockId
		)
	}

	tab = {
		start: (surfaceId: Id) =>  (_: DragEvent) => {
			this.#operation.value = {
				surfaceId: surfaceId,
				proposedDestination: null,
			}
		},
	}

	dock = {
		enter: (dockId: Id) => (event: DragEvent) => {
			const operation = this.#operation.value

			if (!operation)
				return

			const dock = this.#explorer.docks.require(dockId)
			const isWithinTab = isWithin(event.target, `[data-tab-for-surface]`)

			this.#operation.value = isWithinTab
				? (() => {
					const surfaceId = isWithinTab.getAttribute("data-tab-for-surface")!
					const surface = this.#explorer
						.surfaces
						.require(surfaceId)
					return {
						surfaceId: operation.surfaceId,
						proposedDestination: {
							dockId: dock.id,
							surfaceIndex: dock.children.indexOf(surface),
						},
					}
				})()
				: {
					surfaceId: operation.surfaceId,
					proposedDestination: {
						dockId: dock.id,
						surfaceIndex: dock.children.length,
					},
				}
		},

		leave: () => (event: DragEvent) => {
			const operation = this.#operation.value
			if (operation && event.relatedTarget === null)
				this.#operation.value = {
					surfaceId: operation.surfaceId,
					proposedDestination: null,
				}
		},

		over: () => (event: DragEvent) => {
			event.preventDefault()
		},

		end: () => (_: DragEvent) => {
			this.#operation.value = undefined
		},

		drop: () => (_: DragEvent) => {
			const operation = this.#operation.value
			if (operation && operation.proposedDestination)
				this.#actions.moveSurface(
					operation.surfaceId,
					operation.proposedDestination.dockId,
					operation.proposedDestination.surfaceIndex,
				)
			this.#operation.value = undefined
		},
	}
}

