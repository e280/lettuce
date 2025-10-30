
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Studio} from "../../studio.js"
import {Resizer} from "./resize/resizer.js"
import {TabDragger} from "./parts/tab_dragger.js"
import {leaf_management} from "./parts/leaf_management.js"
import {make_layout_renderer} from "./rendering/utils/make_layout_renderer.js"

export const Desk = ({studio}: {studio: Studio<any>}) => (
	view(use => () => {
		use.styles(themeCss, styleCss)

		const {layout, panels, drops} = studio
		const dropzone = drops.editor

		const surfaceManager = use.once(leaf_management(
			use.element,
			layout,
			panels,
		))

		surfaceManager.add_new_leaves()
		surfaceManager.delete_old_leaves()

		const resizer = use.once(() => new Resizer(layout))

		const render_layout = use.once(() => make_layout_renderer({
			layout,
			resizer,
			panels: studio.panels,
			dragger: new TabDragger(layout),
		}))

		return html`
			<div
				class=layout
				@pointermove=${resizer.track_mouse_movement}
				@pointerup=${resizer.end}
				?data-dropzone-indicator=${dropzone.indicator}
				@dragover=${dropzone.dragover}
				@dragleave=${dropzone.dragleave}
				@drop=${dropzone.drop}
				>

				${render_layout(layout.seeker.root)}
			</div>
		`
	})
)

