
import {TemplateResult} from "lit"
import {Resizer} from "../../resize/resizer.js"
import {PanelSpecs} from "../../../../types.js"
import {TabDragger} from "../../parts/tab_dragger.js"
import {Layout} from "../../../../../layout/layout.js"
import {LayoutNode} from "../../../../../layout/types.js"

export type LayoutMeta = {
	resizer: Resizer
	dragger: TabDragger
	layout: Layout
	panels: PanelSpecs
	render_layout: (node: LayoutNode.Any) => TemplateResult
}

