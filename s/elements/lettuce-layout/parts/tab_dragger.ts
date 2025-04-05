
import {Signal, signal} from "@benev/slate"

import {is_within} from "./drag_utils.js"
import {Id} from "../../../tools/fresh_id.js"
import {LettuceContext} from "../../../context/context.js"
import {Layout} from "../../../context/controllers/layout/parts/types.js"
import {LayoutSeeker} from "../../../context/controllers/layout/parts/seeker.js"
import {LayoutActions} from "../../../context/controllers/layout/parts/actions.js"
import {LayoutController} from "../../../context/controllers/layout/controller.js"

export type TabDragOperation = {
	leafId: Id
	proposed_destination: null | {
		paneId: Id
		leafIndex: number
	}
}

export class TabDragger {
	#operation: Signal<TabDragOperation | undefined>
	#seeker: LayoutSeeker
	#actions: LayoutActions

	constructor(public context: LettuceContext, layout: LayoutController) {
		this.#seeker = layout.seeker
		this.#actions = layout.actions
		this.#operation = signal(undefined)
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

			const [pane] = this.#seeker.find<Layout.Pane>(paneId)
			const within_tab = is_within(event.target, `[data-tab-for-leaf]`)

			this.#operation.value = within_tab
				? (() => {
					const leafId = within_tab.getAttribute("data-tab-for-leaf")!
					const [leaf] = this
						.#seeker
						.find<Layout.Leaf>(leafId)
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
				this.#actions.move_leaf(
					operation.leafId,
					operation.proposed_destination.paneId,
					operation.proposed_destination.leafIndex,
				)
			this.#operation.value = undefined
		},
	}
}

