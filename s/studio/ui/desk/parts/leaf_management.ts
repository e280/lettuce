
import {dom} from "@e280/sly"
import {leaf_slot} from "./leaf_slot.js"
import {PanelSpecs} from "../../../types.js"
import {Id} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"

export const leaf_management = (
		element: HTMLElement,
		layout: Layout,
		panels: PanelSpecs,
	) => () => {

	const leafRegistry = new Set<Id>()

	return {

		add_new_leaves() {
			const newLeaves = layout.seeker
				.surfaces
				.filter(leaf => !leafRegistry.has(leaf.id))

			for (const leaf of newLeaves) {
				const key = leaf.panel as any as keyof typeof panels

				if (!(key in panels)) {
					layout.actions.deleteSurface(leaf.id)
					continue
				}

				const div = document.createElement("div")
				div.setAttribute("data-id", leaf.id.toString())
				div.setAttribute("slot", leaf_slot(leaf.id))

				const {render: panelRender} = panels[key]
				const content = panelRender({leafId: leaf.id})

				dom.render(div, content)
				element.appendChild(div)

				leafRegistry.add(leaf.id)
			}
		},

		delete_old_leaves() {
			const allLeaves = layout.seeker.surfaces
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

