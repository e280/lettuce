
import {signal, SignalFn} from "@e280/strata"
import {is_within} from "./drag_utils.js"
import {Layout} from "../../../../layout/layout.js"
import {Seeker} from "../../../../layout/parts/seeker.js"
import {Id, LayoutNode} from "../../../../layout/types.js"
import {Actions} from "../../../../layout/parts/actions.js"

export type TabDragOperation = {
	leafId: Id
	proposed_destination: null | {
		paneId: Id
		leafIndex: number
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

	is_leaf_indicated(paneId: Id, leafIndex: number) {
		const operation = this.#operation.value
		return (
			operation &&
			operation.proposed_destination &&
			operation.proposed_destination.paneId === paneId &&
			operation.proposed_destination.leafIndex === leafIndex
		)
	}

	is_pane_indicated(paneId: Id) {
		const operation = this.#operation.value
		return (
			operation &&
			operation.proposed_destination &&
			operation.proposed_destination.paneId === paneId
		)
	}

	tab = {
		start: (leafId: Id) =>  (_: DragEvent) => {
			this.#operation.value = {
				leafId,
				proposed_destination: null,
			}
		},
	}

	pane = {
		enter: (paneId: Id) => (event: DragEvent) => {
			const operation = this.#operation.value

			if (!operation)
				return

			const [pane] = this.#seeker.find<LayoutNode.Dock>(paneId)
			const within_tab = is_within(event.target, `[data-tab-for-leaf]`)

			this.#operation.value = within_tab
				? (() => {
					const leafId = within_tab.getAttribute("data-tab-for-leaf")!
					const [leaf] = this
						.#seeker
						.find<LayoutNode.Surface>(leafId)
					return {
						leafId: operation.leafId,
						proposed_destination: {
							paneId: pane.id,
							leafIndex: pane.children.indexOf(leaf),
						},
					}
				})()
				: {
					leafId: operation.leafId,
					proposed_destination: {
						paneId: pane.id,
						leafIndex: pane.children.length,
					},
				}
		},
		leave: () => (event: DragEvent) => {
			const operation = this.#operation.value
			if (operation && event.relatedTarget === null)
				this.#operation.value = {
					leafId: operation.leafId,
					proposed_destination: null,
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
			if (operation && operation.proposed_destination)
				this.#actions.moveSurface(
					operation.leafId,
					operation.proposed_destination.paneId,
					operation.proposed_destination.leafIndex,
				)
			this.#operation.value = undefined
		},
	}
}

