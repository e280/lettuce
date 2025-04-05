
import {Layout} from "./parts/types.js"
import {freshId} from "../../../tools/fresh_id.js"

export function single_panel_layout(startingPanel: string) {
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
				panel: startingPanel,
			}],
		}],
	})
}

