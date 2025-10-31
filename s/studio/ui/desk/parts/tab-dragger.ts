
import {signal, SignalFn} from "@e280/strata"
import {isWithin} from "./drag-utils.js"
import {Layout} from "../../../../layout/layout.js"
import {Seeker} from "../../../../layout/parts/seeker.js"
import {Id, LayoutNode} from "../../../../layout/types.js"
import {Actions} from "../../../../layout/parts/actions.js"

export type TabDragOperation = {
	surfaceId: Id
	proposedDestination: null | {
		dockId: Id
		surfaceIndex: number
	}
}

export class TabDragger {
	#operation: SignalFn<TabDragOperation | undefined>
	#seeker: Seeker
	#actions: Actions

	constructor(layout: Layout) {
		this.#seeker = layout.seeker
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

			const [dock] = this.#seeker.find<LayoutNode.Dock>(dockId)
			const isWithinTab = isWithin(event.target, `[data-tab-for-surface]`)

			this.#operation.value = isWithinTab
				? (() => {
					const surfaceId = isWithinTab.getAttribute("data-tab-for-surface")!
					const [surface] = this
						.#seeker
						.find<LayoutNode.Surface>(surfaceId)
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

