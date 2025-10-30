
import {Id, LayoutNode, LayoutReport} from "../types.js"

export class Seeker {
	constructor(private getRoot: () => LayoutNode.Cell) {}

	get root() {
		return this.getRoot()
	}

	*list() {
		const stack: LayoutReport[] = [[this.root, null, 0]]
		while (stack.length > 0) {
			const report = stack.pop()!
			const [current] = report
			if (current) {
				yield report as LayoutReport
				if ("children" in current)
					current.children.forEach((child, index) =>
						stack.push([child, current, index] as LayoutReport))
			}
		}
	}

	find<N extends LayoutNode.Any>(id: Id) {
		for (const result of this.list())
			if (result[0].id === id)
				return result as LayoutReport<N>
		throw new Error(`could not find layout node ${id}`)
	}

	get cells() {
		return [...this.list()]
			.filter(([node]) => node.kind === "cell")
			.map(([node]) => node) as LayoutNode.Cell[]
	}

	get docks() {
		return [...this.list()]
			.filter(([node]) => node.kind === "dock")
			.map(([node]) => node) as LayoutNode.Dock[]
	}

	get surfaces() {
		return [...this.list()]
			.filter(([node]) => node.kind === "surface")
			.map(([node]) => node) as LayoutNode.Surface[]
	}
}

