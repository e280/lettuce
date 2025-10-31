
import {html} from "lit"
import {is} from "@e280/stz"
import {renderTabs} from "./tabs.js"
import {renderSurface} from "./surface.js"
import {LayoutMeta} from "./utils/layout-meta.js"
import {LayoutNode} from "../../../../layout/types.js"
import {sizingStyles} from "../parts/sizing-styles.js"
import {icon_feather_x} from "../../icons/groups/feather/x.js"
import {renderAdderSurface} from "./utils/render-adder-surface.js"
import {icon_akar_panel_split_row} from "../../icons/groups/akar/panel-split-row.js"
import {icon_akar_panel_split_column} from "../../icons/groups/akar/panel-split-column.js"

export const renderDock =
	(meta: LayoutMeta) =>
	(dock: LayoutNode.Dock) => {

	const {layout, gesture} = meta.studio

	const activeSurface = (dock.activeChildIndex !== null)
		? dock.children[dock.activeChildIndex]!
		: null

	const isFocal = dock.id === gesture.focal.value?.dockId

	// TODO
	const isPointerLocked = false

	// const isPointerLocked = activeLeaf
	// 	&& gesture.pointerLock.value?.leafId === activeLeaf.id

	const focalize = () => {
		gesture.focal.value = {
			dockId: dock.id,
			surfaceId: activeSurface && activeSurface.id,
		}
	}

	return html`
		<div
			class=dock
			style="${sizingStyles(dock.size)}"

			?data-is-focal="${isFocal}"
			?data-is-pointer-locked="${isPointerLocked}"
			@pointerover="${focalize}"

			?data-drag=${meta.dragger.isDockIndicated(dock.id)}
			@dragenter=${meta.dragger.dock.enter(dock.id)}
			@dragleave=${meta.dragger.dock.leave()}
			@dragover=${meta.dragger.dock.over()}
			@dragend=${meta.dragger.dock.end()}
			@drop=${meta.dragger.dock.drop()}
			>

			<div class=taskbar>
				<div class=tabs>
					${renderTabs(meta, dock)}
				</div>

				<div class=actions>
					<button @click=${() => layout.actions.splitDock(dock.id, false)}>
						${icon_akar_panel_split_row}
					</button>

					<button @click=${() => layout.actions.splitDock(dock.id, true)}>
						${icon_akar_panel_split_column}
					</button>

					<button class=x @click=${() => layout.actions.deleteDock(dock.id)}>
						${icon_feather_x}
					</button>
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

