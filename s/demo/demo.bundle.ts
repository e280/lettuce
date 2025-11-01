
import {Layout} from "../layout/layout.js"
import {Studio} from "../studio/studio.js"
import {asPanels} from "../studio/types.js"
import {GnuPanel} from "./panels/gnu/panel.js"
import {AboutPanel} from "./panels/about/panel.js"
import {buildStock} from "../layout/build-stock.js"
import {Persistence} from "../studio/persistence.js"
import {BroteinPanel} from "./panels/brotein/panel.js"
import {icon_feather_info} from "../studio/ui/icons/groups/feather/info.js"
import {icon_feather_list} from "../studio/ui/icons/groups/feather/list.js"
import {icon_feather_folder} from "../studio/ui/icons/groups/feather/folder.js"

const panels = asPanels({
	about: {
		label: "about",
		icon: () => icon_feather_info,
		render: () => AboutPanel({
			resetLayout: async() => layout.actions.reset(),
		}),
	},
	gnu: {
		label: "gnu",
		icon: () => icon_feather_list,
		render: () => GnuPanel(),
	},
	brotein: {
		label: "brotein",
		icon: () => icon_feather_folder,
		render: () => BroteinPanel(),
	},
})

const layout = new Layout({
	stock: buildStock(b => ({
		empty: () => b.blank(),
		default: () => b.cell(b.tabs("about", "gnu", "brotein")),
	})),
})

const persistence = new Persistence({
	layout,
	key: "lettuceLayoutBlueprint",
	kv: Persistence.localStorageKv(),
})

await persistence.load()
persistence.setupAutoSave()
persistence.setupLoadOnStorageEvent()

const studio = new Studio({panels, layout})

studio.ui.registerComponents()

