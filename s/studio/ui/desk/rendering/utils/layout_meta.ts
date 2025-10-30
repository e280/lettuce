
import {TemplateResult} from "lit"
import {Studio} from "../../../../studio.js"
import {Resizer} from "../../resize/resizer.js"
import {TabDragger} from "../../parts/tab_dragger.js"
import {LayoutNode} from "../../../../../layout/types.js"

export type LayoutMeta = {
	resizer: Resizer
	dragger: TabDragger
	studio: Studio
	render_layout: (node: LayoutNode.Any) => TemplateResult
}

