
import {signal} from "@e280/strata"
import {Ui} from "./ui/ui.js"
import {Layout} from "../layout/layout.js"
import {Focal, PanelSpecs, StudioOptions} from "./types.js"

export class Studio<PS extends PanelSpecs = PanelSpecs> {
	panels: PS
	layout: Layout
	ui: Ui

	focal = signal<Focal | null>(null)

	constructor(options: StudioOptions<PS>) {
		this.panels = options.panels
		this.layout = options.layout
		this.ui = new Ui(this)
	}
}

