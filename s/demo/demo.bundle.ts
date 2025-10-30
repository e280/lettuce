
import {Layout} from "../layout/layout.js"
import {Studio} from "../studio/studio.js"
import {AboutPanel} from "./panels/about/panel.js"
import {Persistence} from "../studio/persistence.js"

const panels = Studio.asPanels({
	about: {
		label: "about",
		icon: () => "A",
		render: () => AboutPanel(),
	},
	unknown: {
		label: "unknown",
		icon: () => "U",
		render: () => "UNKNOWN",
	},
})

const layout = new Layout({
	empty: () => Layout.makeCell<keyof typeof panels>("about"),
	default: () => Layout.makeCell<keyof typeof panels>("about"),
})

const studio = new Studio({panels, layout})
await Persistence.setup({layout})
studio.ui.registerComponents()

