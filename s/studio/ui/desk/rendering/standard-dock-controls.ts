
import {html} from "lit"
import {Content} from "@e280/sly"

import {listPanelsChoices} from "./utils/list-panels.js"
import {TaskbarAlignment} from "../../../../layout/types.js"
import {DockContext, DockControlsFn} from "../../../types.js"
import {icon_feather_x} from "../../icons/groups/feather/x.js"
import {icon_feather_home} from "../../icons/groups/feather/home.js"
import {icon_akar_panel_split_row} from "../../icons/groups/akar/panel-split-row.js"
import {icon_akar_panel_split_column} from "../../icons/groups/akar/panel-split-column.js"

export type StandardControlsParts = ReturnType<typeof standardControlsParts>

export const standardControlsParts = (ctx: DockContext) => {
	const {studio} = ctx.meta
	const {layout} = studio
	const dock = ctx.dock

	const split = (vertical: boolean) => () => html`
		<sl-button
			size=small
			class="standard-button"
			@click=${() => layout.actions.splitDock(dock.id, vertical)}
			title=${vertical ? "split vertically" : "split horizontally"}
		>
			${vertical ? icon_akar_panel_split_column : icon_akar_panel_split_row}
		</sl-button>
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
			<sl-button
				size=small
				class=x
				title="close dock"
				@click=${() => layout.actions.deleteDock(dock.id)}
			>
				${icon_feather_x}
			</sl-button>
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
			const choices = listPanelsChoices(ctx.meta, dock)

			return html`
				${choices.map(choice => html`
					<sl-menu-item
						style="padding-bottom: 0.5em;"
						value=${choice.name}
						?disabled=${choice.disabled}
						@click=${choice.open}>
						<span style="display: flex; padding-right: 0.5em;" slot=prefix class="icon">${choice.icon}</span>
						<span style="width: 100%;">
							${choice.label}
						</span>
					</sl-menu-item>
				`)}
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
	const startGripDrag = (event: PointerEvent) => {
		event.stopPropagation()
		ctx.meta.taskbarDragger.start(ctx.dock.id);
		(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
	}
	const standard = standardControlsParts(ctx)
	const vertical = ctx.dock.taskbarAlignment === "right" || ctx.dock.taskbarAlignment === "left"
	return vertical
		? html`
			<sl-dropdown placement="right-end">
				<sl-button slot="trigger" caret></sl-button>
				<sl-menu>
					<div style="display: flex; padding: 0.5em 0;">
						${standard.closeDock()}
						${standard.splitHorizontal()}
						${standard.splitVertical()}
					</div>
					${standard.spawnPanel()}
				<sl-menu>
			</sl-dropdown>
			<sl-icon-button
				name="grip-vertical"
				label="grip"
				@pointerdown=${startGripDrag}
			></sl-icon-button>
		`
		: html`
			<sl-dropdown placement="top">
				<sl-button slot="trigger" caret></sl-button>
				<sl-menu>
					<div style="display: flex; padding: 0.5em 0;">
						${standard.closeDock()}
						${standard.splitHorizontal()}
						${standard.splitVertical()}
					</div>
					${standard.spawnPanel()}
				<sl-menu>
			</sl-dropdown>
			<sl-icon-button
				name="grip-vertical"
				label="grip"
				@pointerdown=${startGripDrag}
			></sl-icon-button>
		`
}

