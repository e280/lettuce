
import {deep} from "@e280/stz"
import {Trunk} from "@e280/strata"
import {Seeker} from "./parts/seeker.js"
import {Actions} from "./parts/actions.js"
import {makeCell} from "./parts/make-cell.js"
import {LayoutNode, BlueprintTree, LayoutStock, Blueprint} from "./types.js"

export class Layout {
	static makeCell = makeCell

	seeker: Seeker
	actions: Actions
	#blueprint: BlueprintTree

	constructor(stock: LayoutStock) {
		const root = stock.default()
		this.#blueprint = new Trunk({root})
		this.seeker = new Seeker(() => this.#blueprint.state.root as LayoutNode.Cell)
		this.actions = new Actions(this.#blueprint, stock)
	}

	getBlueprint() {
		return deep.clone(this.#blueprint.state) as Blueprint
	}

	async setBlueprint(blueprint: Blueprint) {
		await this.#blueprint.overwrite(blueprint)
	}
}

