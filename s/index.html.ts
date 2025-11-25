
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
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/themes/dark.css"
			onload="document.documentElement.classList.add('sl-theme-dark');"
		/>
		<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.1/cdn/shoelace.js" ></script>
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
		<lettuce-desk></lettuce-desk>
	`,
}))

