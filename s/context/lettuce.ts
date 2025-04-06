
import {register_to_dom} from "@benev/slate"

import {Salad} from "./salad.js"
import {PanelSpecs} from "./panels/types.js"
import {LayoutHelper} from "./layout-helper.js"
import {PanelHelper} from "./panels/panel-helper.js"
import {LettuceLayout} from "../elements/lettuce-layout/element.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

export class Lettuce<xPanels extends PanelSpecs, xLayouts extends StockLayouts> {
	constructor(public panels: xPanels, public layouts: xLayouts) {}

	static panels = <xPanels extends PanelSpecs>(panelFn: (helper: PanelHelper) => xPanels) => ({
		layout: <xLayouts extends StockLayouts>(layoutFn: (helper: LayoutHelper<xPanels>) => xLayouts) =>
			new this<xPanels, xLayouts>(
				panelFn(new PanelHelper()),
				layoutFn(new LayoutHelper<xPanels>()),
			),
	})

	setContext() {
		Salad.nexus.context = new Salad(this)
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

