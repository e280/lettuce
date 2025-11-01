
import {html} from "lit"
import {LayoutMeta} from "./layout-meta.js"
import {LayoutNode} from "../../../../../layout/types.js"

export function renderAdderSurface(
		{studio: {layout, panels}}: LayoutMeta,
		dock: LayoutNode.Dock,
	) {

	function click(name: string) {
		return async() => {
			const {index} = await layout.actions.addSurface(dock.id, name)
			await layout.actions.setDockActiveSurface(dock.id, index)
		}
	}

	return html`${Object.entries(panels)
		.map(([name, panel]) => html`
			<button @click="${click(name)}">
				${panel.icon()}
				<span>${panel.label}</span>
			</button>
		`)}`
}

