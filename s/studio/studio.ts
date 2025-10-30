
import {Ui} from "./ui/ui.js"
import {Layout} from "../layout/layout.js"
import {Gesture} from "./ui/facilities/gesture/gesture.js"
import {asPanels, PanelSpecs, StudioOptions} from "./types.js"

export class Studio<PS extends PanelSpecs = PanelSpecs> {
	static asPanels = asPanels

	panels: PS
	layout: Layout
	ui: Ui

	gesture = new Gesture()

	constructor(options: StudioOptions<PS>) {
		this.panels = options.panels
		this.layout = options.layout
		this.ui = new Ui(this)
	}

	// TODO
	persistence: any
	controls: any
	drops: any
}

