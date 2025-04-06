
import {html} from "@benev/slate"

import {styles} from "./styles.css.js"
import {Resizer} from "./resize/resizer.js"
import {Salad} from "../../context/salad.js"
import {TabDragger} from "./parts/tab_dragger.js"
import {leaf_management} from "./parts/leaf_management.js"
import {make_layout_renderer} from "./rendering/utils/make_layout_renderer.js"

export const LettuceLayout = Salad.nexus.shadowComponent(use => {
	use.styles(styles)

	const {layout, panels, drops} = use.context
	const dropzone = drops.editor

	use.watch(() => layout.root)

	const leaves = use.once(leaf_management({
		panels,
		element: use.element,
		seeker: layout.seeker,
		actions: layout.actions,
	}))

	leaves.add_new_leaves()
	leaves.delete_old_leaves()

	const resizer = use.once(() => new Resizer(layout))

	const render_layout = use.once(() => make_layout_renderer({
		layout,
		resizer,
		panels: use.context.panels,
		dragger: new TabDragger(use.context, layout),
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

			${render_layout(layout.root)}
		</div>
	`
})

