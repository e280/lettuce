
import {html} from "lit"
import {view} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Studio} from "../../studio.js"
import {Resizer} from "./resize/resizer.js"
import {clamp} from "../../../tools/numerical.js"
import {TabDragger} from "./parts/tab-dragger.js"
import {TaskbarDragger} from "./parts/taskbar-dragger.js"
import {makeLayoutRenderer} from "./rendering/utils/make-layout-renderer.js"
import {containerRect, isPointerInside, outOfBoundsDistance} from "./parts/drag-utils.js"

export const Desk = (
	({studio}: {studio: Studio<any>}) =>
	view(use => () => {

	use.name("lettuce-desk")
	use.styles(themeCss, styleCss)

	const {layout, renderer} = studio
	const renderSurfaces = use.once(() => renderer(use.element))
	const resizer = use.once(() => new Resizer(layout))
	const tabDragger = use.once(() => new TabDragger(layout))
	const renderLayout = use.once(() => makeLayoutRenderer({
		studio,
		resizer,
		tabDragger,
		taskbarDragger: new TaskbarDragger(layout),
	}))

	const DRAG_THRESHOLD = 3
	const handle = {
		onTabMove: (e: PointerEvent) => {
			const drag = tabDragger.dragState
			if (!drag) return

			const dx = e.clientX - drag.origin.x
			const dy = e.clientY - drag.origin.y

			if (!drag.lifted) {
				if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD)
					return

				drag.lifted = true
			}

			const dockEl = e.composedPath().find(el => (el as HTMLElement).className === "dock") as HTMLElement
			const tabsRect = dockEl
				? containerRect(dockEl.querySelector('.tabs'))
				: null

			let primaryInside = false

			if (tabsRect) {
				const inside = isPointerInside(e, tabsRect)
				const {dx: dxOut, dy: dyOut} = outOfBoundsDistance(e, tabsRect)
				const ESCAPE_MARGIN = 0

				primaryInside = inside || (dxOut < ESCAPE_MARGIN && dyOut < ESCAPE_MARGIN)
			}

			const primaryOffset = drag.axis === 'x' ? dx : dy
			const oxLocked = drag.axis === 'x' ? clamp(primaryOffset, drag.bounds.min, drag.bounds.max) : 0
			const oyLocked = drag.axis === 'y' ? clamp(primaryOffset, drag.bounds.min, drag.bounds.max) : 0
			const isForeignDock = dockEl?.dataset.dockId !== tabDragger.sourceDockId

			if (primaryInside && !isForeignDock) {
				tabDragger.dragState = {
					...drag,
					clamped: true,
					position: {x: oxLocked, y: oyLocked}
				}
			} else {
				tabDragger.dragState = {
					...drag,
					clamped: false,
					position: {x: dx, y: dy}
				}
			}
			const targetDock = dockEl
			if (targetDock) {
				tabDragger.preview(targetDock, {x: e.clientX, y: e.clientY})
			}
			else {
				tabDragger.clearPreview()
			}
		}
	}

	use.mount(() => {
		window.addEventListener("pointermove", handle.onTabMove)
		return () => window.removeEventListener("pointermove", handle.onTabMove)
	})

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

