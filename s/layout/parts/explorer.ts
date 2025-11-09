
import {Scout} from "./scout.js"
import {Cell, Dock, LayoutNode, Surface, WalkReport} from "../types.js"

/** facility for reading/querying layout state */
export class Explorer {
	constructor(private getRoot: () => Cell) {}

	/** get the root node of the layout blueprint */
	get root() {
		return this.getRoot()
	}

	/** iterate over every layout node in the tree, yielding report objects */
	*walk(): Iterable<WalkReport> {
		const stack: WalkReport[] = [{
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

	*#kind<N extends LayoutNode = LayoutNode>(kind: N["kind"]) {
		for (const report of this.walk())
			if (report.node.kind === kind)
				yield report as WalkReport<N>
	}

	all = new Scout<LayoutNode>(() => this.walk())
	cells = new Scout<Cell>(() => this.#kind("cell"))
	docks = new Scout<Dock>(() => this.#kind("dock"))
	surfaces = new Scout<Surface>(() => this.#kind("surface"))
}

