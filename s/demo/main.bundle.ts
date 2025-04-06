
import {html} from "@benev/slate"
import {Lettuce} from "../context/lettuce.js"
import {getMetaVersion} from "../tools/get-meta-version.js"
import {icon_feather_info} from "../icons/groups/feather/info.js"
import {icon_feather_list} from "../icons/groups/feather/list.js"
import {copypastaGnuPlusLettuce, copypastaNavySeal} from "./lorem.js"
import {icon_feather_help_circle} from "../icons/groups/feather/help-circle.js"

import loremCss from "./styles/lorem.css.js"
import aboutCss from "./styles/about.css.js"
import unknownCss from "./styles/unknown.css.js"

Lettuce
	.panels(panel => ({

		about: panel.shadowView({
			label: "about",
			icon: () => icon_feather_info,
			render: use => _props => {
				use.name("about")
				use.styles(aboutCss)
				const version = use.once(() => getMetaVersion())
				return html`
					<div class=plate>
						<img alt="" src="/assets/lettuce.avif"/>
						<h2><span>lettuce</span> <span>v${version}</span></h2>
						<p>a leafy panelling ui system for cool apps</p>
						<p>go to the github, nerd: <a href="http://github.com/e280/lettuce">github.com/e280/lettuce</a></p>
					<div>
				`
			},
		}),

		lorem: panel.shadowView({
			label: "lorem",
			icon: () => icon_feather_list,
			render: use => _props => {
				use.name("lorem")
				use.styles(loremCss)
				return html`
					<section>
						<h1>Lorem Ipsum</h1>
						${copypastaGnuPlusLettuce()}
						<h1>Dolor Sit Amet</h1>
						${copypastaNavySeal()}
					</section>
				`
			},
		}),

		unknown: panel.shadowView({
			label: "unknown",
			icon: () => icon_feather_help_circle,
			render: use => _props => {
				use.name("unknown")
				use.styles(unknownCss)
				return html`<h1>unknown</h1>`
			},
		}),
	}))

	.layout(layout => ({
		default: layout.single("about"),
		empty: layout.single("about"),
	}))

	.setup()

