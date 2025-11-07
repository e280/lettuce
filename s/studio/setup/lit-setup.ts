
import {html} from "lit"
import {Content, dom} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"
import {LitPanels, Renderer} from "../types.js"

export const litRenderer = (panels: LitPanels): Renderer => (
	element => surfaces => dom.render(element, repeat(surfaces, s => s.id, surface => html`
		<div slot="${surface.id}" data-panel="${surface.panel}">
			${panels[surface.panel].render(surface)}
		</div>
	`) as Content)
)

export const litSetup = <Ps extends LitPanels>(panels: Ps) => ({
	panels,
	renderer: litRenderer(panels),
})

