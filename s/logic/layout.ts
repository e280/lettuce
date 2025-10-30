
import {Trunk} from "@e280/strata"
import {Dom} from "./parts/dom.js"
import {Seeker} from "./parts/seeker.js"
import {Actions} from "./parts/actions.js"
import {makeCell} from "./parts/make-cell.js"
import {asPanels, LayoutNode, LayoutOptions, LayoutTree, PanelSpecs} from "./types.js"

export class Layout<PS extends PanelSpecs> {
	static asPanels = asPanels
	static makeCell = makeCell

	#tree: LayoutTree
	seeker: Seeker
	actions: Actions
	dom: Dom

	constructor(options: LayoutOptions<PS>) {
		const root = options.stock.default()
		this.#tree = new Trunk({root})
		this.seeker = new Seeker(() => this.#tree.state.root as LayoutNode.Cell)
		this.actions = new Actions(this.#tree, options)
		this.dom = new Dom(this)
	}

	persistence: any
	panels: any
	controls: any
	gesture: any
	drops: any
}

