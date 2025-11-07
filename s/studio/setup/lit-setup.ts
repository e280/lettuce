
import {html} from "lit"
import {dom} from "@e280/sly"
import {LitPanels, Renderer} from "../types.js"
import {surfaceSlot} from "../ui/desk/parts/surface-slot.js"

export const litSetup = <Ps extends LitPanels>(panels: Ps) => ({
	panels,
	renderer: <Renderer>(
		element => surfaces => dom.render(element, surfaces.map(surface => html`
			<div
				data-panel="${surface.panel}"
				slot="${surfaceSlot(surface.id)}"
				data-id="${surface.id}">

				${panels[surface.panel].render(surface)}
			</div>
		`))
	),
})

