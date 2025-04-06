
import {register_to_dom} from "@benev/slate"

import {LettuceContext} from "./context.js"
import {LayoutHelper} from "./layout-helper.js"
import {PanelSpecs} from "../panels/panel_parts.js"
import {LettuceLayout} from "../elements/lettuce-layout/element.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

export class Lettuce<xPanels extends PanelSpecs, xLayouts extends StockLayouts> {
	// static nexus = new Nexus<LettuceContext>()

	constructor(public panels: xPanels, public layouts: xLayouts) {}

	static panels = <xPanels extends PanelSpecs>(panels: xPanels) => ({
		layout: <xLayouts extends StockLayouts>(fn: (helper: LayoutHelper<xPanels>) => xLayouts) =>
			new this<xPanels, xLayouts>(panels, fn(new LayoutHelper<xPanels>())),
	})

	setContext() {
		LettuceContext.nexus.context = new LettuceContext(this)
		return this
	}

	getElements() {
		return {LettuceLayout}
	}

	setup() {
		this.setContext()
		register_to_dom(this.getElements())
		return this
	}
}

