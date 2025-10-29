
import {html, ssg} from "@e280/scute"

const domain = "lettuce.e280.org"
const favicon = "/assets/lettuce.png"

export default ssg.page(import.meta.url, async orb => ({
	title: "@e280/lettuce",
	js: "./demo/demo.bundle.min.js",
	css: "./demo/demo.css",
	dark: true,
	favicon,

	head: html`
		<meta data-version="${orb.packageVersion()}"/>
	`,

	socialCard: {
		title: "lettuce",
		siteName: "e280.org",
		description: "splitty panelly leafy layouts",
		themeColor: "#8FCC8F",
		url: `https://${domain}/`,
		image: `https://${domain}${favicon}`,
	},

	body: html`
		<lettuce-layout></lettuce-layout>
	`,
}))

