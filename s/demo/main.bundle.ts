
import {setupLettuce} from "../setup.js"
import {AboutPanel} from "./panels/about/panel.js"
import {UnknownPanel} from "./panels/unknown/panel.js"
import {single_panel_layout} from "../context/controllers/layout/single_panel_layout.js"

setupLettuce({
	panels: {AboutPanel, UnknownPanel},
	layouts: {
		default: single_panel_layout("AboutPanel"),
		empty: single_panel_layout("AboutPanel"),
	},
})

