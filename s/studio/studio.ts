
import {Ui} from "./ui/ui.js"
import {Layout} from "../layout/layout.js"
import {PanelSpecs, StudioOptions} from "./types.js"
import {Gesture} from "./facilities/gesture/gesture.js"

export class Studio<PS extends PanelSpecs = PanelSpecs> {
	panels: PS
	layout: Layout
	ui: Ui
	gesture = new Gesture()

	constructor(options: StudioOptions<PS>) {
		this.panels = options.panels
		this.layout = options.layout
		this.ui = new Ui(this)
	}
}

