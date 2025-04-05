
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {lettuceNexus} from "../../../context/context.js"
import {panel, PanelProps} from "../../../panels/panel_parts.js"
import {icon_feather_help_circle} from "../../../icons/groups/feather/help-circle.js"

export const UnknownPanel = panel({
	label: "unknown",
	icon: icon_feather_help_circle,

	view: lettuceNexus.shadowView(use => ({}: PanelProps) => {
		use.name("unknown")
		use.styles(styles)
		return html`
			<h1>unknown</h1>
		`
	}),
})

