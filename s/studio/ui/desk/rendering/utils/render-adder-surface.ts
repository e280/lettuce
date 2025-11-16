
import {html} from "lit"
import {LayoutMeta} from "./layout-meta.js"
import {Dock} from "../../../../../layout/types.js"

export function renderAdderSurface(
		{studio: {layout, panels, ...stuff}}: LayoutMeta,
		dock: Dock,
	) {

	const computePanelUsage = () => layout.explorer.surfaces.nodes
		.reduce((counts, surface) => {
			counts.set(surface.panel, (counts.get(surface.panel) ?? 0) + 1)
			return counts
		}, new Map<string, number>())

	const atLimit = (name: string, limit?: number, counts = computePanelUsage()) => {
		if (typeof limit !== "number" || !Number.isFinite(limit))
			return false
		if (limit <= 0) return true
		return (counts.get(name) ?? 0) >= limit
	}

	function click(name: string, limit?: number) {
		return async() => {
			if (atLimit(name, limit))
				return
			const {index} = await layout.actions.addSurface(dock.id, name)
			await layout.actions.setDockActiveSurface(dock.id, index)
		}
	}

	const counts = computePanelUsage()

	return html`${Object.entries(panels)
		.map(([name, panel]) => html`
			<button
				@click="${click(name, panel.limit)}"
				?disabled="${atLimit(name, panel.limit, counts)}">
				${panel.icon({studio: {layout, panels, ...stuff}, dock})}
				<span>${panel.label}</span>
			</button>
		`)}`
}

