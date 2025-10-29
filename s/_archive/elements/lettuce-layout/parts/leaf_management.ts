
import {render} from "@benev/slate"

import {leaf_slot} from "./leaf_slot.js"
import {Id} from "../../../tools/fresh_id.js"
import {PanelSpecs} from "../../../context/panels/types.js"
import {LayoutSeeker} from "../../../context/controllers/layout/parts/seeker.js"
import {LayoutActions} from "../../../context/controllers/layout/parts/actions.js"

export const leaf_management = ({
		element, seeker, actions, panels,
	}: {
		element: HTMLElement
		panels: PanelSpecs
		seeker: LayoutSeeker
		actions: LayoutActions
	}) => () => {

	const leafRegistry = new Set<Id>()

	return {

		add_new_leaves() {
			const newLeaves = seeker
				.leaves
				.filter(leaf => !leafRegistry.has(leaf.id))

			for (const leaf of newLeaves) {
				const key = leaf.panel as any as keyof typeof panels

				if (!(key in panels)) {
					actions.delete_leaf(leaf.id)
					continue
				}

				const div = document.createElement("div")
				div.setAttribute("data-id", leaf.id.toString())
				div.setAttribute("slot", leaf_slot(leaf.id))

				const {render: panelRender} = panels[key]
				const content = panelRender({leafId: leaf.id})

				render(content, div)
				element.appendChild(div)

				leafRegistry.add(leaf.id)
			}
		},

		delete_old_leaves() {
			const allLeaves = seeker.leaves
			const oldLeaves = [...leafRegistry]
				.filter(id => !allLeaves.some(leaf => leaf.id === id))
				// .filter(id => {
				// 	const leaf = allLeaves.find(leaf => leaf.id === id)
				// 	return leaf
				// 		? !(leaf.panel in panels)
				// 		: true
				// })

			for (const id of oldLeaves) {
				const div = element
					.querySelector<HTMLElement>(`[data-id="${id}"]`)

				if (div)
					div.remove()

				leafRegistry.delete(id)
			}
		},
	}
}

