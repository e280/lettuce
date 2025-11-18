
import {html} from "lit"
import {Content} from "@e280/sly"

import {TaskbarAlignment} from "../../../../layout/types.js"
import {DockContext, DockControlsFn} from "../../../types.js"
import {icon_feather_x} from "../../icons/groups/feather/x.js"
import {listAdderChoices} from "./utils/list-adder-choices.js"
import {icon_feather_home} from "../../icons/groups/feather/home.js"
import {icon_feather_plus} from "../../icons/groups/feather/plus.js"
import {icon_akar_panel_split_row} from "../../icons/groups/akar/panel-split-row.js"
import {icon_akar_panel_split_column} from "../../icons/groups/akar/panel-split-column.js"

export type StandardControlsParts = ReturnType<typeof standardControlsParts>

export const standardControlsParts = (ctx: DockContext) => {
	const {studio} = ctx.meta
	const {layout} = studio
	const dock = ctx.dock
	const vertical = ctx.dock.taskbarAlignment === "right" || ctx.dock.taskbarAlignment === "left"

	const split = (vertical: boolean) => () => html`
		<sl-menu-item @click=${() => layout.actions.splitDock(dock.id, vertical)}>
			<sl-button title=${vertical ? "split vertically" : "split horizontally"}>
				${vertical ? icon_akar_panel_split_column : icon_akar_panel_split_row}
			</sl-button>
		</sl-menu-item>
	`

	const align = (alignment: TaskbarAlignment, icon: () => Content) => html`
		<sl-menu-item @click="${() => layout.actions.setDockTaskbarAlignment(dock.id, alignment)}">
			<sl-button title="${`align to ${alignment}`}">
				${icon()}
			</sl-button>
		</sl-menu-item>
	`

	return {
		closeDock: () => html`
			<sl-menu-item @click=${() => layout.actions.deleteDock(dock.id)}>
				<sl-button class=x title="close dock" >
					${icon_feather_x}
				</sl-button>
			</sl-menu-item>
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
			const choices = listAdderChoices(ctx.meta, dock)

			return html`
				<sl-dropdown class=spawn-dropdown placement=${vertical ? "right-start" : "top"}>
					<sl-button
						slot=trigger
						data-adder
						title="add panel"
						?data-active="${active}"
					>
						<span class=icon>
							${icon_feather_plus}
						</span>
					</sl-button>
					<sl-menu>
						${choices.map(choice => html`
							<sl-menu-item
								value=${choice.name}
								?disabled=${choice.disabled}
								@click=${choice.open}>
								<span slot=prefix class="icon">${choice.icon}</span>
								${choice.label}
							</sl-menu-item>
						`)}
					</sl-menu>
				</sl-dropdown>
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
			<sl-icon-button name="grip-vertical" label="grip"></sl-icon-button>
			<sl-dropdown placement="right-end">
				<sl-button slot="trigger" caret></sl-button>
				<sl-menu>
					${standard.closeDock()}
					${standard.splitHorizontal()}
					${standard.splitVertical()}
					${standard.taskbarAlignment.top()}
					${standard.taskbarAlignment.left()}
					${standard.taskbarAlignment.right()}
					${standard.taskbarAlignment.bottom()}
				<sl-menu>
			</sl-dropdown>
			${standard.spawnPanel()}
		`
		: html`
			${standard.spawnPanel()}
			<sl-dropdown placement="top">
				<sl-button slot="trigger" caret></sl-button>
				<sl-menu>
					${standard.closeDock()}
					${standard.taskbarAlignment.left()}
					${standard.taskbarAlignment.top()}
					${standard.taskbarAlignment.bottom()}
					${standard.taskbarAlignment.right()}
					${standard.splitHorizontal()}
					${standard.splitVertical()}
				<sl-menu>
			</sl-dropdown>
			<sl-icon-button name="grip-vertical" label="grip"></sl-icon-button>
		`
}

