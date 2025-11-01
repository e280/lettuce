
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Studio} from "../../studio.js"
import {Resizer} from "./resize/resizer.js"
import {TabDragger} from "./parts/tab-dragger.js"
import {SurfaceManager} from "./parts/surface-manager.js"
import {makeLayoutRenderer} from "./rendering/utils/make-layout-renderer.js"

export const Desk = (
	({studio}: {studio: Studio<any>}) =>
	view(use => () => {

	use.styles(themeCss, styleCss)
	const {layout, panels} = studio

	const surfaceManager = use.once(() => new SurfaceManager(
		use.element,
		layout,
		panels,
	))

	surfaceManager.addNewSurfaces()
	surfaceManager.deleteOldSurfaces()

	const resizer = use.once(() => new Resizer(layout))

	const renderLayout = use.once(() => makeLayoutRenderer({
		studio,
		resizer,
		dragger: new TabDragger(layout),
	}))

	return html`
		<div
			class=layout
			@pointermove=${resizer.track_mouse_movement}
			@pointerup=${resizer.end}
			>

			${renderLayout(layout.explorer.root)}
		</div>
	`
}))

