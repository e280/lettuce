
import {freshId} from "../tools/fresh_id.js"
import {PanelSpecs} from "../panels/panel_parts.js"
import {Layout} from "./controllers/layout/parts/types.js"

export class LayoutHelper<xPanels extends PanelSpecs> {
	single(panel: keyof xPanels) {
		return (): Layout.Cell => ({
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
					panel: panel as string,
				}],
			}],
		})
	}
}

