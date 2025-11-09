
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Studio} from "../../studio.js"
import {Resizer} from "./resize/resizer.js"
import {TabDragger} from "./parts/tab-dragger.js"
import {makeLayoutRenderer} from "./rendering/utils/make-layout-renderer.js"

export const Desk = (
	({studio}: {studio: Studio<any>}) =>
	view(use => () => {

	use.name("lettuce-desk")
	use.styles(themeCss, styleCss)

	const {layout, renderer} = studio
	const renderSurfaces = use.once(() => renderer(use.element))
	const resizer = use.once(() => new Resizer(layout))
	const renderLayout = use.once(() => makeLayoutRenderer({
		studio,
		resizer,
		dragger: new TabDragger(layout),
	}))

	// render light-dom
	renderSurfaces(layout.explorer.surfaces.nodes)

	// render shadow-dom
	return html`
		<div
			class="layout"
			@pointermove="${resizer.track_mouse_movement}"
			@pointerup="${resizer.end}">

			${renderLayout(layout.explorer.root)}
		</div>
	`
}))

