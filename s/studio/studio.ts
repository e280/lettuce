
import {signal} from "@e280/strata"
import {Ui} from "./ui/ui.js"
import {Layout} from "../layout/layout.js"
import {Focal, Panels, Renderer, StudioOptions} from "./types.js"

export class Studio<Ps extends Panels = Panels> {
	panels: Ps
	renderer: Renderer
	layout: Layout
	ui: Ui

	focal = signal<Focal | null>(null)

	constructor(options: StudioOptions<Ps>) {
		this.panels = options.panels
		this.layout = options.layout
		this.renderer = options.renderer
		this.ui = new Ui(this)
	}
}

