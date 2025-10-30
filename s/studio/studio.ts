
import {Ui} from "./ui/ui.js"
import {Layout} from "../layout/layout.js"
import {asPanels, PanelSpecs, StudioOptions} from "./types.js"

export class Studio<PS extends PanelSpecs> {
	static asPanels = asPanels

	panels: PS
	layout: Layout
	ui: Ui

	constructor(options: StudioOptions<PS>) {
		this.panels = options.panels
		this.layout = options.layout
		this.ui = new Ui(this)
	}

	// TODO
	persistence: any
	controls: any
	gesture: any
	drops: any
}

