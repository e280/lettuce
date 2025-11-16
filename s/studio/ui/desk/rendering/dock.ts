
import {html} from "lit"
import {is} from "@e280/stz"
import {renderTabs} from "./tabs.js"
import {renderSurface} from "./surface.js"
import {Dock} from "../../../../layout/types.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {sizingStyles} from "../parts/sizing-styles.js"
import {renderAdderSurface} from "./utils/render-adder-surface.js"

export const renderDock =
	(meta: LayoutMeta) =>
	(dock: Dock) => {

	const {studio, dragger} = meta

	const activeSurface = (dock.activeChildIndex !== null)
		? dock.children[dock.activeChildIndex]!
		: null

	const isFocal = dock.id === studio.focal.value?.dockId
	const isPointerLocked = false
	const buttons = studio.dockButtons({
		studio,
		dock
	})

	const focalize = () => {
		studio.focal.value = {
			dockId: dock.id,
			surfaceId: activeSurface && activeSurface.id,
		}
	}

	return html`
		<div
			class=dock
			data-taskbar-alignment="${dock.taskbarAlignment}"
			style="${sizingStyles(dock.size)}"

			?data-is-focal="${isFocal}"
			?data-is-pointer-locked="${isPointerLocked}"
			@pointerover="${focalize}"

			?data-drag="${dragger.isDockIndicated(dock.id)}"
			@dragenter="${dragger.dock.enter(dock.id)}"
			@dragleave="${dragger.dock.leave()}"
			@dragover="${dragger.dock.over()}"
			@dragend="${dragger.dock.end()}"
			@drop="${dragger.dock.drop()}">

			<div class=taskbar>
				<div class=tabs>
					${renderTabs(meta, dock)}
				</div>

				<div class=actions>
					${buttons}
				</div>
			</div>

			${is.happy(dock.activeChildIndex)
				? html`
					<div class="surface panel">
						${renderSurface(meta)(dock.children[dock.activeChildIndex])}
					</div>
				`
				: html`
					<div class="surface adder">
						${renderAdderSurface(meta, dock)}
					</div>
				`
			}
		</div>
	`
}

