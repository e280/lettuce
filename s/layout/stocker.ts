
import {LayoutNode} from "./types.js"
import {freshId} from "../tools/fresh-id.js"
import {PanelSpecs} from "../studio/types.js"

export class Stocker<PS extends PanelSpecs> {
	tabs = (...panels: (keyof PS)[]): LayoutNode.Dock => ({
		kind: "dock",
		id: freshId(),
		size: null,
		activeChildIndex: panels.length === 0
			? null
			: 0,
		children: panels.map(panel => ({
			kind: "surface",
			id: freshId(),
			panel: panel as string,
		})),
	})

	cell = (...children: (LayoutNode.Cell | LayoutNode.Dock)[]): LayoutNode.Cell => ({
		kind: "cell",
		id: freshId(),
		size: null,
		vertical: false,
		children,
	})

	horizontal = this.cell

	vertical = (...children: (LayoutNode.Cell | LayoutNode.Dock)[]): LayoutNode.Cell => ({
		kind: "cell",
		id: freshId(),
		size: null,
		vertical: true,
		children,
	})

	blank = () => this.cell(this.tabs())
	singleton = (panel: keyof PS) => this.cell(this.tabs(panel))

	setup = <R>(fn: (stocker: Stocker<PS>) => R) => fn(this)
}

