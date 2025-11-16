import {html} from "lit"

import type {Studio} from "../../../studio.js"
import {icon_feather_x} from "../../icons/groups/feather/x.js"
import {icon_feather_home} from "../../icons/groups/feather/home.js"
import {icon_feather_plus} from "../../icons/groups/feather/plus.js"
import {DockContext, DockButtonsFn, StandardButtons} from "../../../types.js"
import {icon_akar_panel_split_row} from "../../icons/groups/akar/panel-split-row.js"
import {icon_akar_panel_split_column} from "../../icons/groups/akar/panel-split-column.js"

export const standardButtonsParts = (studio: Studio<any>): StandardButtons => {
	const {layout} = studio

	const split = (vertical: boolean) => ({dock}: DockContext) => html`
		<button
			title=${vertical ? "split vertically" : "split horizontally"}
			@click=${() => layout.actions.splitDock(dock.id, vertical)}>
			${vertical ? icon_akar_panel_split_column : icon_akar_panel_split_row}
		</button>
	`

	return {
		closeDock: ({dock}) => html`
			<button class=x title="close dock" @click=${() => layout.actions.deleteDock(dock.id)}>
				${icon_feather_x}
			</button>
		`,
		splitHorizontal: split(false),
		splitVertical: split(true),
		spawnPanel: ({dock}) => html`
			<button title="add panel" @click=${() => layout.actions.setDockActiveSurface(dock.id, null)}>
				${icon_feather_plus}
			</button>
		`,
		resetLayout: () => html`
			<button title="reset layout" @click=${() => layout.actions.reset()}>
				${icon_feather_home}
			</button>
		`,
	}
}

export const standardButtons: DockButtonsFn = (ctx) => {
	const standard = standardButtonsParts(ctx.studio)
	return html`
		${standard.closeDock(ctx)}
		${standard.splitHorizontal(ctx)}
		${standard.splitVertical(ctx)}
	`
}
