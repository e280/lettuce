
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {LettuceContext} from "../../../context/context.js"
import {panel, PanelProps} from "../../../panels/panel_parts.js"
import {getMetaVersion} from "../../../tools/get-meta-version.js"
import {icon_feather_info} from "../../../icons/groups/feather/info.js"

export const AboutPanel = panel({
	label: "about",
	icon: icon_feather_info,

	view: LettuceContext.nexus.shadowView(use => ({}: PanelProps) => {
		use.name("about")
		use.styles(styles)

		const version = use.once(() => getMetaVersion())

		return html`
			<div class=plate>
				<img alt="" src="/assets/lettuce.avif"/>
				<h2><span>lettuce</span> <span>v${version}</span></h2>
				<p>a leafy panelling ui system for cool apps</p>
				<p>go to the github, nerd: <a href="http://github.com/e280/lettuce">github.com/e280/lettuce</a></p>
			<div>
		`
	}),
})

