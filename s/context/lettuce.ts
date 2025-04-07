
import {Context, Nexus} from "@benev/slate"

import {theme} from "./theme.js"
import {Salad} from "./salad.js"
import {PanelSpecs} from "./panels/types.js"
import {store} from "./controllers/store/store.js"
import {Gesture} from "./controllers/gesture/controller.js"
import {LayoutController} from "./controllers/layout/controller.js"
import {DropCoordinator} from "./controllers/drop_coordinator/controller.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

export class Lettuce<
		xPanels extends PanelSpecs = PanelSpecs,
		xLayouts extends StockLayouts = StockLayouts,
	> extends Context {

	/** slate nexus for initializing views and stuff */
	static nexus = new Nexus<Lettuce>()

	/** css theme applied across all lettuce views and components (but not your panels actually) */
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

	constructor({panels, layouts}: Salad<xPanels, xLayouts>) {
		super()
		this.panels = panels
		this.layout = new LayoutController(this.store, layouts)
	}
}

