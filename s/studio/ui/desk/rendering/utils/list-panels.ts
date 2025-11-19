
import {LayoutMeta} from "./layout-meta.js"
import {Dock} from "../../../../../layout/types.js"

export function listPanelsChoices(meta: LayoutMeta, dock: Dock) {
	const {studio: {layout, panels}} = meta

	const atLimit = (panel: string, limit = Infinity) => {
		if (!Number.isFinite(limit))
			return false

		const panelCount = layout.explorer.surfaces.nodes
			.filter(surface => surface.panel === panel)
			.length

		return (panelCount >= limit)
	}

	function open(name: string) {
		return async() => {
			const {index} = await layout.actions.addSurface(dock.id, name)
			await layout.actions.setDockActiveSurface(dock.id, index)
		}
	}

	return Object.entries(panels).map(([name, panel]) => ({
		name,
		label: panel.label,
		icon: panel.icon({meta, dock}),
		disabled: atLimit(name, panel.limit),
		open: open(name),
	}))
}
