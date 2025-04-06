
import {Context, Nexus} from "@benev/slate"

import {theme} from "./theme.js"
import {Lettuce} from "./lettuce.js"
import {store} from "./controllers/store/store.js"
import {PanelSpecs} from "../panels/panel_parts.js"
import {Gesture} from "./controllers/gesture/controller.js"
import {LayoutController} from "./controllers/layout/controller.js"
import {DropCoordinator} from "./controllers/drop_coordinator/controller.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

export class LettuceContext<xPanels extends PanelSpecs = PanelSpecs, xLayouts extends StockLayouts = StockLayouts> extends Context {
	static nexus = new Nexus<LettuceContext>()

	theme = theme

	/** editor app persistence */
	store = store(localStorage)

	/** panels available to the user */
	panels: xPanels

	/** layout state, actions, and helpers */
	layout: LayoutController

	/** user input, pointer lock, and focalization */
	gesture = new Gesture()

	/** drop events */
	drops = new DropCoordinator()

	constructor({panels, layouts}: Lettuce<xPanels, xLayouts>) {
		super()

		this.panels = panels

		this.layout = new LayoutController(
			this.store,
			layouts,
		)
	}
}

