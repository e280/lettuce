
import {Trunk} from "@e280/strata"
import {Seeker} from "./parts/seeker.js"
import {Actions} from "./parts/actions.js"
import {LayoutNode, LayoutOptions, LayoutTree} from "./types.js"

export class Layout {
	#tree: LayoutTree
	seeker: Seeker
	actions: Actions

	constructor(options: LayoutOptions) {
		const root = options.stock.default()
		this.#tree = new Trunk({root})
		this.seeker = new Seeker(() => this.#tree.state.root as LayoutNode.Cell)
		this.actions = new Actions(this.#tree, options)
	}

	persistence: any
	panels: any
	controls: any
	gesture: any
	drops: any
}

