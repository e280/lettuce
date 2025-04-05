
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {lettuceNexus} from "../../../context/context.js"
import {panel, PanelProps} from "../../../panels/panel_parts.js"
import {icon_feather_info} from "../../../icons/groups/feather/info.js"

export const AboutPanel = panel({
	label: "about",
	icon: icon_feather_info,

	view: lettuceNexus.shadowView(use => ({}: PanelProps) => {
		use.name("about")
		use.styles(styles)
		return html`
			<div class=logo>
				🥬
			</div>
		`
	}),
})

