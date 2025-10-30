
import {LayoutNode} from "../types.js"
import {freshId} from "../../tools/fresh-id.js"

export function makeCell<K extends string>(panelLabel: K): LayoutNode.Cell {
	return {
		id: freshId(),
		kind: "cell",
		size: null,
		vertical: true,
		children: [{
			id: freshId(),
			kind: "dock",
			size: null,
			activeChildIndex: 0,
			children: [{
				id: freshId(),
				kind: "surface",
				panel: panelLabel as string,
			}],
		}],
	}
}

