
import {Id, LayoutNode, ParentOf, WalkReport} from "../types.js"

export class Scout<N extends LayoutNode> {
	constructor(public iterate: () => Iterable<WalkReport<N>>) {}

	getReport(id: Id) {
		for (const report of this.iterate())
			if (report.node.id === id)
				return report as WalkReport<N>
	}

	requireReport(id: Id) {
		const report = this.getReport(id)
		if (!report) throw new Error(`layout node not found with id (${id})`)
		return report
	}

	/** get a node, or undefined if not found */
	get(id: Id) {
		return this.getReport(id)?.node
	}

	/** require a node, throw error if missing */
	require(id: Id) {
		return this.requireReport(id).node
	}

	/** get the parent, or throw error if it has no parent */
	parent(id: Id) {
		const report = this.requireReport(id)
		if (report.path.length === 0) throw new Error(`node has no parent "${id}"`)
		return report.path[report.path.length - 1] as ParentOf<N>
	}

	/** get an array of these reports */
	get reports() {
		return [...this.iterate()]
	}

	/** get an array of these nodes */
	get nodes() {
		return this.reports.map(report => report.node)
	}
}

