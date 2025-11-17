
import {html} from "lit"
import {Content} from "@e280/sly"

import {TaskbarAlignment} from "../../../../layout/types.js"
import {DockContext, DockControlsFn} from "../../../types.js"
import {icon_feather_x} from "../../icons/groups/feather/x.js"
import {icon_feather_home} from "../../icons/groups/feather/home.js"
import {icon_feather_plus} from "../../icons/groups/feather/plus.js"
import {icon_akar_panel_split_row} from "../../icons/groups/akar/panel-split-row.js"
import {icon_akar_panel_split_column} from "../../icons/groups/akar/panel-split-column.js"

export type StandardControlsParts = ReturnType<typeof standardControlsParts>

export const standardControlsParts = (ctx: DockContext) => {
	const {studio, dragger} = ctx.meta
	const {layout} = studio
	const dock = ctx.dock

	const split = (vertical: boolean) => () => html`
		<button
			title=${vertical ? "split vertically" : "split horizontally"}
			@click=${() => layout.actions.splitDock(dock.id, vertical)}>
			${vertical ? icon_akar_panel_split_column : icon_akar_panel_split_row}
		</button>
	`

	const align = (alignment: TaskbarAlignment, icon: () => Content) => html`
		<button
			title="${`align to ${alignment}`}"
			@click="${() => layout.actions.setDockTaskbarAlignment(dock.id, alignment)}">
			${icon()}
		</button>
	`

	return {
		closeDock: () => html`
			<button class=x title="close dock" @click=${() => layout.actions.deleteDock(dock.id)}>
				${icon_feather_x}
			</button>
		`,
		splitHorizontal: split(false),
		splitVertical: split(true),
		taskbarAlignment: {
			top: () => align("top", () => "⬆️"),
			right: () => align("right", () => "➡️"),
			bottom: () => align("bottom", () => "⬇️"),
			left: () => align("left", () => "⬅️"),
		},
		spawnPanel: () => {
			const active = dock.activeChildIndex === null
			const showDragIndicator = dragger.isSurfaceIndicated(dock.id, dock.children.length)
			const activate = () => layout.actions.setDockActiveSurface(dock.id, null)

			return html`
				<div class=spawn data-tab-control>
					<div class=insert-indicator ?data-drag="${showDragIndicator}"></div>

					<button
						data-adder
						title="add new tab"
						?data-active="${active}"
						@click="${activate}"
					>
						<span class=icon>
							${icon_feather_plus}
						</span>
					</button>
				</div>
			`
		},
		resetLayout: () => html`
			<button title="reset layout" @click=${() => layout.actions.reset()}>
				${icon_feather_home}
			</button>
		`,
	}
}

export const standardControls: DockControlsFn = (ctx) => {
	const standard = standardControlsParts(ctx)
	const vertical = ctx.dock.taskbarAlignment === "right" || ctx.dock.taskbarAlignment === "left"
	return vertical
		? html`
			${standard.spawnPanel()}
			${standard.closeDock()}
			${standard.splitHorizontal()}
			${standard.splitVertical()}
			${standard.taskbarAlignment.top()}
			${standard.taskbarAlignment.left()}
			${standard.taskbarAlignment.right()}
			${standard.taskbarAlignment.bottom()}
		`
		: html`
			${standard.spawnPanel()}
			${standard.taskbarAlignment.left()}
			${standard.taskbarAlignment.top()}
			${standard.taskbarAlignment.bottom()}
			${standard.taskbarAlignment.right()}
			${standard.splitHorizontal()}
			${standard.splitVertical()}
			${standard.closeDock()}
		`
}

