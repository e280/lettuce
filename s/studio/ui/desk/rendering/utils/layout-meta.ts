
import {TemplateResult} from "lit"
import {Studio} from "../../../../studio.js"
import {Resizer} from "../../resize/resizer.js"
import {LayoutNode} from "../../../../../layout/types.js"
import {TabDragger} from "../../parts/tab-dragger.js"
import {TaskbarDragger} from "../../parts/taskbar-dragger.js"

export type LayoutMeta = {
	resizer: Resizer
	tabDragger: TabDragger
	taskbarDragger: TaskbarDragger
	studio: Studio
	renderLayout: (node: LayoutNode) => TemplateResult
}

