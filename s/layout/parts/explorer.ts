
import {Scout} from "./scout.js"
import {LayoutNode, LayoutReport} from "../types.js"

/** facility for reading/querying layout state */
export class Explorer {
	constructor(private getRoot: () => LayoutNode.Cell) {}

	/** get the root node of the layout blueprint */
	get root() {
		return this.getRoot()
	}

	/** iterate over every layout node in the tree, yielding report objects */
	*walk(): Iterable<LayoutReport> {
		const stack: LayoutReport[] = [{
			node: this.root,
			index: 0,
			path: [],
		}]
		while (stack.length > 0) {
			const report = stack.shift()!
			yield report
			if ("children" in report.node) {
				for (const [index, child] of report.node.children.entries())
					stack.push({
						node: child,
						index,
						path: [...report.path, report.node],
					})
			}
		}
	}

	*#kind<N extends LayoutNode.Any = LayoutNode.Any>(kind: N["kind"]) {
		for (const report of this.walk())
			if (report.node.kind === kind)
				yield report as LayoutReport<N>
	}

	/** return the total count of all layout nodes in the tree */
	get count() {
		let n = 0
		for (const _ of this.walk()) n++
		return n
	}

	all = new Scout<LayoutNode.Any>(() => this.walk())
	cells = new Scout<LayoutNode.Cell>(() => this.#kind("cell"))
	docks = new Scout<LayoutNode.Dock>(() => this.#kind("dock"))
	surfaces = new Scout<LayoutNode.Surface>(() => this.#kind("surface"))
}

