
import {deep, Sub} from "@e280/stz"
import {Lens, Prism} from "@e280/strata"
import {Actions} from "./parts/actions.js"
import {Explorer} from "./parts/explorer.js"
import {Blueprint, LayoutOptions, Cell, Stock} from "./types.js"
import {normalizeBlueprint} from "./parts/normalize-blueprint.js"

export class Layout {
	static readonly version = 1

	stock: Stock
	explorer: Explorer
	actions: Actions
	on: Sub<[Blueprint]>
	#prism: Prism<Blueprint>
	#lens: Lens<Blueprint>

	constructor(options: LayoutOptions) {
		this.stock = options.stock
		const root = options.stock.default()

		this.#prism = new Prism({version: Layout.version, root})
		this.#lens = this.#prism.lens(s => s)
		this.on = this.#prism.on

		this.explorer = new Explorer(() => this.#lens.state.root as Cell)
		this.actions = new Actions(this.#lens, options.stock)
	}

	getBlueprint() {
		return deep.clone(this.#lens.state) as Blueprint
	}

	async setBlueprint(blueprint: Blueprint) {
		await this.#prism.set(
			normalizeBlueprint({
				blueprint,
				currentVersion: Layout.version,
				stock: this.stock,
			})
		)
	}
}

