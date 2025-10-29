
import {Layout} from "./types.js"
import {Id} from "../../../../tools/fresh_id.js"

export class LayoutSeeker {
	constructor(private getRoot: () => Layout.Cell) {}

	get root() { return this.getRoot() }

	*list() {
		const stack: Layout.Report[] = [[this.root, null, 0]]
		while (stack.length > 0) {
			const report = stack.pop()!
			const [current] = report
			if (current) {
				yield report as Layout.Report
				if ("children" in current)
					current.children.forEach((child, index) =>
						stack.push([child, current, index] as Layout.Report))
			}
		}
	}

	find<N extends Layout.Node>(id: Id) {
		for (const result of this.list())
			if (result[0].id === id)
				return result as Layout.Report<N>
		throw new Error(`could not find layout node ${id}`)
	}

	get cells() {
		return [...this.list()]
			.filter(([node]) => node.kind === "cell")
			.map(([node]) => node) as Layout.Cell[]
	}

	get panes() {
		return [...this.list()]
			.filter(([node]) => node.kind === "pane")
			.map(([node]) => node) as Layout.Pane[]
	}

	get leaves() {
		return [...this.list()]
			.filter(([node]) => node.kind === "leaf")
			.map(([node]) => node) as Layout.Leaf[]
	}
}

