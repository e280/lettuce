
import {deep, Sub} from "@e280/stz"
import {Immutable, Trunk} from "@e280/strata"
import {Actions} from "./parts/actions.js"
import {Explorer} from "./parts/explorer.js"
import {BlueprintTree, Blueprint, LayoutOptions, Cell} from "./types.js"

export class Layout {
	static readonly version = 1

	explorer: Explorer
	actions: Actions
	on: Sub<[Immutable<Blueprint>]>
	#blueprint: BlueprintTree

	constructor(private options: LayoutOptions) {
		const root = options.stock.default()
		this.#blueprint = new Trunk({version: Layout.version, root})
		this.on = this.#blueprint.on
		this.explorer = new Explorer(() => this.#blueprint.state.root as Cell)
		this.actions = new Actions(this.#blueprint, options.stock)
	}

	getBlueprint() {
		return deep.clone(this.#blueprint.state) as Blueprint
	}

	async setBlueprint(blueprint: Blueprint) {
		if (blueprint.version !== Layout.version) {
			console.warn(`layout blueprint invalid version (${blueprint.version}), reverting to default stock layout at version (${Layout.version})`)
			const root = this.options.stock.default()
			blueprint = {version: Layout.version, root}
		}

		await this.#blueprint.overwrite(blueprint)
	}
}

