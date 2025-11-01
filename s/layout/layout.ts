
import {Trunk} from "@e280/strata"
import {deep, Sub} from "@e280/stz"
import {Actions} from "./parts/actions.js"
import {Explorer} from "./parts/explorer.js"
import {normalizeBlueprint} from "./parts/normalize-blueprint.js"
import {BlueprintTree, Blueprint, LayoutOptions, Cell, Stock} from "./types.js"

export class Layout {
	static readonly version = 1

	stock: Stock
	explorer: Explorer
	actions: Actions
	on: Sub<[Blueprint]>
	#blueprint: BlueprintTree

	constructor(options: LayoutOptions) {
		this.stock = options.stock
		const root = options.stock.default()
		this.#blueprint = new Trunk({version: Layout.version, root})
		this.on = this.#blueprint.on as any
		this.explorer = new Explorer(() => this.#blueprint.state.root as Cell)
		this.actions = new Actions(this.#blueprint, options.stock)
	}

	getBlueprint() {
		return deep.clone(this.#blueprint.state) as Blueprint
	}

	async setBlueprint(blueprint: Blueprint) {
		await this.#blueprint.overwrite(
			normalizeBlueprint({
				blueprint,
				currentVersion: Layout.version,
				stock: this.stock,
			})
		)
	}
}

