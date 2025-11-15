
import {html} from "lit"
import {LayoutMeta} from "./layout-meta.js"
import {Dock} from "../../../../../layout/types.js"

export function renderAdderSurface(
		{studio: {layout, panels}}: LayoutMeta,
		dock: Dock,
	) {

	const atLimit = (panel: string, limit = Infinity) => {
		if (!Number.isFinite(limit))
			return false

		const panelCount = layout.explorer.surfaces.nodes
			.filter(surface => surface.panel === panel)
			.length

		return (panelCount >= limit)
	}

	function click(name: string) {
		return async() => {
			const {index} = await layout.actions.addSurface(dock.id, name)
			await layout.actions.setDockActiveSurface(dock.id, index)
		}
	}

	return html`${Object.entries(panels)
		.map(([name, panel]) => html`
			<button
				@click="${click(name)}"
				?disabled="${atLimit(name, panel.limit)}">
				${panel.icon()}
				<span>${panel.label}</span>
			</button>
		`)}`
}

