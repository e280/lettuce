
import {html} from "lit"
import {LayoutMeta} from "./layout-meta.js"
import {LayoutNode} from "../../../../../layout/types.js"

export function renderAdderSurface(
		{studio: {layout, panels}}: LayoutMeta,
		dock: LayoutNode.Dock,
	) {

	function click(name: string) {
		return async() => {
			const [, leafIndex] = await layout.actions.addSurface(
				dock.id,
				name as any,
			)
			await layout.actions.setDockActiveSurface(
				dock.id,
				leafIndex,
			)
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

