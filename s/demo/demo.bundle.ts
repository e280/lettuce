
import {Layout} from "../logic/layout.js"
import {AboutPanel} from "./panels/about/panel.js"

const panels = Layout.asPanels({
	about: {
		label: "about",
		icon: () => "A",
		render: () => AboutPanel(),
	},
	unknown: {
		label: "unknown",
		icon: () => "U",
		render: () => "UNKNOWN",
	},
})

const layout = new Layout({
	panels,
	stock: {
		empty: () => Layout.makeCell(panels, "unknown"),
		default: () => Layout.makeCell(panels, "about"),
	},
})



// import {cssReset, html, nexus} from "@benev/slate"
// import {Salad} from "../context/salad.js"
// import {getMetaVersion} from "../tools/get-meta-version.js"
// import {icon_feather_info} from "../icons/groups/feather/info.js"
// import {icon_feather_list} from "../icons/groups/feather/list.js"
// import {copypastaGnuPlusLettuce, copypastaNavySeal} from "./stuff/lorem.js"
// import {icon_feather_help_circle} from "../icons/groups/feather/help-circle.js"
//
// import loremCss from "./styles/lorem.css.js"
// import aboutCss from "./styles/about.css.js"
// import unknownCss from "./styles/unknown.css.js"
//
// nexus.context.theme = cssReset
//
// Salad
// 	.panels(pan => ({
//
// 		about: pan.shadowView({
// 			label: "about",
// 			icon: () => icon_feather_info,
// 			render: use => _props => {
// 				use.name("about")
// 				use.styles(aboutCss)
// 				const version = use.once(() => getMetaVersion())
// 				return html`
// 					<div class=plate>
// 						<img alt="" src="/assets/lettuce.avif"/>
// 						<h2><span>lettuce</span> <span>v${version}</span></h2>
// 						<p>a leafy panelling ui system for cool apps</p>
// 						<p>go to the github, nerd: <a href="http://github.com/e280/lettuce">github.com/e280/lettuce</a></p>
// 					<div>
// 				`
// 			},
// 		}),
//
// 		lorem: pan.shadowView({
// 			label: "lorem",
// 			icon: () => icon_feather_list,
// 			render: use => _props => {
// 				use.name("lorem")
// 				use.styles(loremCss)
// 				return html`
// 					<section>
// 						<h1>Lorem Ipsum</h1>
// 						${copypastaGnuPlusLettuce()}
// 						<h1>Dolor Sit Amet</h1>
// 						${copypastaNavySeal()}
// 					</section>
// 				`
// 			},
// 		}),
//
// 		unknown: pan.shadowView({
// 			label: "unknown",
// 			icon: () => icon_feather_help_circle,
// 			render: use => _props => {
// 				use.name("unknown")
// 				use.styles(unknownCss)
// 				return html`<h1>unknown</h1>`
// 			},
// 		}),
// 	}))
//
// 	.layout(layman => ({
// 		default: layman.single("about"),
// 		empty: layman.single("about"),
// 	}))
//
// 	.setup()

