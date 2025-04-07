
import {register_to_dom} from "@benev/slate"

import {Layman} from "./layman.js"
import {Lettuce} from "./lettuce.js"
import {Pan, pan} from "./panels/pan.js"
import {PanelSpecs} from "./panels/types.js"
import {LettuceLayout} from "../elements/lettuce-layout/element.js"
import {StockLayouts} from "./controllers/layout/parts/utils/stock_layouts.js"

/** lettuce setup helper. it's just a tool to make installing lettuce easier. */
export class Salad<xPanels extends PanelSpecs, xLayouts extends StockLayouts> {
	static pan = pan

	static panels = <xPanels extends PanelSpecs>(panelFn: (pan: Pan) => xPanels) => ({
		layout: <xLayouts extends StockLayouts>(layoutFn: (layman: Layman<xPanels>) => xLayouts) =>
			new this<xPanels, xLayouts>(
				panelFn(pan),
				layoutFn(new Layman<xPanels>()),
			),
	})

	constructor(public panels: xPanels, public layouts: xLayouts) {}

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

