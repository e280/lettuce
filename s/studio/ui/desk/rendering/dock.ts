
import {html, nothing} from "lit"
import {is} from "@e280/stz"

import {renderTabs} from "./tabs.js"
import {renderSurface} from "./surface.js"
import {Dock} from "../../../../layout/types.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {sizingStyles} from "../parts/sizing-styles.js"

export const renderDock =
	(meta: LayoutMeta) =>
	(dock: Dock) => {

	const {studio, tabDragger, ...rest} = meta
	const taskbarDragger = rest.taskbarDragger

	const activeSurface = (dock.activeChildIndex !== null)
		? dock.children[dock.activeChildIndex]!
		: null

	const isFocal = dock.id === studio.focal.value?.dockId
	const isPointerLocked = false
	const controls = studio.dockControls({
		dock,
		meta
	})

	const dropIndex = tabDragger.dockDropIndex(dock.id)
	const dropAtEnd = dropIndex === dock.children.length

	const focalize = () => {
		studio.focal.value = {
			dockId: dock.id,
			surfaceId: activeSurface && activeSurface.id,
		}
	}

	const isForeignDockIndicated = tabDragger.isDockIndicated(dock.id) && tabDragger.sourceDockId !== dock.id
	const previewAlignment = taskbarDragger.previewAlignment(dock)

	const onDockPointerMove = (event: PointerEvent) => {
		if (taskbarDragger.isDraggingDock(dock.id)) {
			const {left, top, width, height} = (event.currentTarget as HTMLElement).getBoundingClientRect()
			taskbarDragger.updatePreview(
				{left, top, width, height},
				{x: event.clientX, y: event.clientY},
			)
		}
	}

	const onDockPointerUp = async() => {
		await meta.tabDragger.drop()
		if (taskbarDragger.isDraggingDock(dock.id))
			await taskbarDragger.drop()
	}

	const onDockPointerCancel = () => {
		if (taskbarDragger.isDraggingDock(dock.id))
			taskbarDragger.cancel()
	}

	const isDraggingDock = taskbarDragger.isDraggingDock(dock.id)

	return html`
		<div
			class=dock
			part=dock
			data-dock-id="${dock.id}"
			data-taskbar-alignment="${previewAlignment}"
			style="${sizingStyles(dock.size)}"
			?data-is-focal="${isFocal}"
			?data-is-pointer-locked="${isPointerLocked}"
			?data-dock-drag=${isDraggingDock}
			?data-drag="${isForeignDockIndicated}"
			@pointerover="${focalize}"
			@pointermove="${onDockPointerMove}"
			@pointerup="${onDockPointerUp}"
			@pointercancel="${onDockPointerCancel}">

			<div class=taskbar part=taskbar>
				<div
					class=tabs
					style=${isForeignDockIndicated ? `--tab-shift-size: ${tabDragger.dragState?.tabSize}px;` : nothing}
					?data-drop-terminal="${dropAtEnd}">
					${renderTabs(meta, dock)}
				</div>

				<div class="actions">
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

