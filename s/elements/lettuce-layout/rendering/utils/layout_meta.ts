
import {Pojo} from "@benev/slate"
import {TemplateResult} from "lit"

import {Resizer} from "../../resize/resizer.js"
import {TabDragger} from "../../parts/tab_dragger.js"
import {PanelSpec} from "../../../../context/panels/types.js"
import {Layout} from "../../../../context/controllers/layout/parts/types.js"
import {LayoutController} from "../../../../context/controllers/layout/controller.js"

export type LayoutMeta = {
	resizer: Resizer
	dragger: TabDragger
	layout: LayoutController
	panels: Pojo<PanelSpec>
	render_layout: (node: Layout.Node) => TemplateResult
}

