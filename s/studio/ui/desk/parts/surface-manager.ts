
import {dom} from "@e280/sly"
import {PanelSpecs} from "../../../types.js"
import {surfaceSlot} from "./surface-slot.js"
import {Id} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"

export class SurfaceManager {
	#registry = new Set<Id>()

	constructor(
		public element: HTMLElement,
		public layout: Layout,
		public panels: PanelSpecs,
	) {}

	addNewSurfaces() {
		const newSurfaces = this.layout.seeker
			.surfaces
			.filter(surface => !this.#registry.has(surface.id))

		for (const surface of newSurfaces) {
			const key = surface.panel as any as keyof typeof this.panels

			if (!(key in this.panels)) {
				this.layout.actions.deleteSurface(surface.id)
				continue
			}

			const div = document.createElement("div")
			div.setAttribute("data-id", surface.id.toString())
			div.setAttribute("slot", surfaceSlot(surface.id))

			const panel = this.panels[key]
			const content = panel.render({surfaceId: surface.id})

			dom.render(div, content)
			this.element.appendChild(div)
			this.#registry.add(surface.id)
		}
	}

	deleteOldSurfaces() {
		const allSurfaces = this.layout.seeker.surfaces
		const oldSurfaces = (
			[...this.#registry]
				.filter(id => !allSurfaces.some(leaf => leaf.id === id))
		)
		for (const id of oldSurfaces) {
			const div = this.element.querySelector<HTMLElement>(`[data-id="${id}"]`)
			if (div) div.remove()
			this.#registry.delete(id)
		}
	}
}

