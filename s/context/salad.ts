
import {register_to_dom} from "@benev/slate"

import {Lettuce} from "./lettuce.js"
import {PanelSpecs} from "./panels/types.js"
import {LayoutHelper} from "./layout-helper.js"
import {PanelHelper, panels} from "./panels/panel-helper.js"
import {LettuceLayout} from "../elements/lettuce-layout/element.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

export class Salad<xPanels extends PanelSpecs, xLayouts extends StockLayouts> {
	constructor(public panels: xPanels, public layouts: xLayouts) {}

	static panels = <xPanels extends PanelSpecs>(panelFn: (helper: PanelHelper) => xPanels) => ({
		layout: <xLayouts extends StockLayouts>(layoutFn: (helper: LayoutHelper<xPanels>) => xLayouts) =>
			new this<xPanels, xLayouts>(
				panelFn(panels),
				layoutFn(new LayoutHelper<xPanels>()),
			),
	})

	setContext() {
		const lettuce = new Lettuce(this)
		Lettuce.nexus.context = lettuce
		return lettuce
	}

	getElements() {
		return {LettuceLayout}
	}

	setup() {
		const lettuce = this.setContext()
		register_to_dom(this.getElements())
		return lettuce
	}
}

