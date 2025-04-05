
import {Context, Nexus, Pojo} from "@benev/slate"

import {theme} from "./theme.js"
import {store} from "./controllers/store/store.js"
import {PanelSpec} from "../panels/panel_parts.js"
import {Gesture} from "./controllers/gesture/controller.js"
import {LayoutController} from "./controllers/layout/controller.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"
import {DropCoordinator} from "./controllers/drop_coordinator/controller.js"

export interface LettuceOptions {
	panels: Pojo<PanelSpec>,
	layouts: StockLayouts,
}

export class LettuceContext extends Context {
	theme = theme

	/** editor app persistence */
	store = store(localStorage)

	/** panels available to the user */
	panels: Pojo<PanelSpec>

	/** layout state, actions, and helpers */
	layout: LayoutController

	/** user input, pointer lock, and focalization */
	gesture = new Gesture()

	/** drop events */
	drops = new DropCoordinator()

	constructor({panels, layouts}: LettuceOptions) {
		super()

		this.panels = panels

		this.layout = new LayoutController(
			this.store,
			layouts,
		)
	}
}

export const lettuceNexus = new Nexus<LettuceContext>()

