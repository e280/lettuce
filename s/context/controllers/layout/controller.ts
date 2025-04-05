
import {StateTree, debounce, watch} from "@benev/slate"

import {Store} from "../store/store.js"
import {Layout} from "./parts/types.js"
import {LayoutSeeker} from "./parts/seeker.js"
import {prepare_layout_actions} from "./parts/actions.js"
import {StockLayouts} from "./parts/utils/stock_layouts.js"

export const save_delay = 300

export class LayoutController {
	#tree: StateTree<Layout.Cell>
	actions: ReturnType<typeof prepare_layout_actions>

	constructor(
			public store: Store,
			public stock_layouts: StockLayouts,
		) {

		this.#tree = watch.stateTree<Layout.Cell>(stock_layouts.default())
		this.#load_from_store()

		this.actions = prepare_layout_actions(this.#tree, stock_layouts)

		watch.track(
			() => this.root,
			() => this.#debounced_save(),
		)
	}

	get root() {
		return this.#tree.state
	}

	get seeker() {
		return new LayoutSeeker(() => this.root)
	}

	reset_to_default() {
		this.#tree.transmute(() => this.stock_layouts.default())
	}

	#load_from_store() {
		const layoutFile = this.store.layout
		if (layoutFile)
			this.#tree.transmute(() => layoutFile.root)
	}

	#save_to_store() {
		this.store.layout = {
			version: 0,
			root: structuredClone(this.root),
		}
	}

	#debounced_save = debounce(
		save_delay,
		() => this.#save_to_store(),
	)
}

