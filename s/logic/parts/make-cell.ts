
import {freshId} from "../../tools/fresh-id.js"
import {LayoutNode, PanelSpecs} from "../types.js"

export function makeCell<PS extends PanelSpecs>(panels: PS, panelLabel: keyof PS): LayoutNode.Cell {
	if (!(panelLabel in panels))
		throw new Error(`panelLabel "${panelLabel as string}" missing in panels specs`)
	return {
		id: freshId(),
		kind: "cell",
		size: null,
		vertical: true,
		children: [{
			id: freshId(),
			kind: "pane",
			size: null,
			active_leaf_index: 0,
			children: [{
				id: freshId(),
				kind: "leaf",
				panel: panelLabel as string,
			}],
		}],
	}
}

