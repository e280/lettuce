
import {Trunk} from "@e280/strata"
import {Ui} from "./parts/ui.js"
import {Seeker} from "./parts/seeker.js"
import {Actions} from "./parts/actions.js"
import {makeCell} from "./parts/make-cell.js"
import {asPanels, LayoutNode, LayoutOptions, BlueprintTree, PanelSpecs} from "./types.js"

export class Layout<PS extends PanelSpecs> {
	static asPanels = asPanels
	static makeCell = makeCell

	#blueprint: BlueprintTree
	seeker: Seeker
	actions: Actions
	ui: Ui

	constructor(options: LayoutOptions<PS>) {
		const root = options.stock.default()
		this.#blueprint = new Trunk({root})
		this.seeker = new Seeker(() => this.#blueprint.state.root as LayoutNode.Cell)
		this.actions = new Actions(this.#blueprint, options)
		this.ui = new Ui(this)
	}

	persistence: any
	panels: any
	controls: any
	gesture: any
	drops: any
}

