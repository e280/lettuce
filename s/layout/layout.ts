
import {deep, Sub} from "@e280/stz"
import {Immutable, Trunk} from "@e280/strata"
import {Seeker} from "./parts/seeker.js"
import {Actions} from "./parts/actions.js"
import {LayoutNode, BlueprintTree, Blueprint, LayoutOptions} from "./types.js"

export class Layout {
	seeker: Seeker
	actions: Actions
	on: Sub<[Immutable<Blueprint>]>
	#blueprint: BlueprintTree

	constructor(options: LayoutOptions) {
		const root = options.stock.default()
		this.#blueprint = new Trunk({root})
		this.on = this.#blueprint.on
		this.seeker = new Seeker(() => this.#blueprint.state.root as LayoutNode.Cell)
		this.actions = new Actions(this.#blueprint, options.stock)
	}

	getBlueprint() {
		return deep.clone(this.#blueprint.state) as Blueprint
	}

	async setBlueprint(blueprint: Blueprint) {
		await this.#blueprint.overwrite(blueprint)
	}
}

