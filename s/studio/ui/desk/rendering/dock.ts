
import {html} from "lit"
import {is} from "@e280/stz"
import {renderTabs} from "./tabs.js"
import {renderSurface} from "./surface.js"
import {Dock} from "../../../../layout/types.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {sizingStyles} from "../parts/sizing-styles.js"

export const renderDock =
	(meta: LayoutMeta) =>
	(dock: Dock) => {

	const {studio, dragger} = meta

	const activeSurface = (dock.activeChildIndex !== null)
		? dock.children[dock.activeChildIndex]!
		: null

	const isFocal = dock.id === studio.focal.value?.dockId
	const isPointerLocked = false
	const controls = studio.dockControls({
		dock,
		meta
	})

	const dropIndex = dragger.dockDropIndex(dock.id)
	const dropAtEnd = dropIndex === dock.children.length

	const focalize = () => {
		studio.focal.value = {
			dockId: dock.id,
			surfaceId: activeSurface && activeSurface.id,
		}
	}

	return html`
		<div
			class=dock
			part=dock
			data-dock-id="${dock.id}"
			data-taskbar-alignment="${dock.taskbarAlignment}"
			style="${sizingStyles(dock.size)}"

			?data-is-focal="${isFocal}"
			?data-is-pointer-locked="${isPointerLocked}"
			@pointerover="${focalize}"

			?data-drag="${dragger.isDockIndicated(dock.id)}">

			<div class=taskbar part=taskbar>
				<div
					class=tabs
					?data-drop-terminal="${dropAtEnd}">
					${renderTabs(meta, dock)}
				</div>

				<div class=actions>
					${controls}
				</div>
			</div>

			${is.happy(dock.activeChildIndex)
				? html`
					<div class="surface panel" part=surface>
						${renderSurface(meta)(dock.children[dock.activeChildIndex])}
					</div>
				`
				: null}
		</div>
	`
}
