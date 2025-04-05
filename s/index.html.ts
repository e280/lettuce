
import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, unsanitized, renderSocialCard} from "@benev/turtle"

const domain = "lettuce.e280.org"
const favicon = "/assets/lettuce.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "lettuce",
		head: html`
			<link rel="icon" href="${favicon}"/>
			<style>${unsanitized(await read_file("x/demo/style.css"))}</style>
			<meta data-commit-hash="${hash}"/>

			${renderSocialCard({
				themeColor: "#93c053",
				siteName: "e280.org",
				title: "lettuce",
				description: "splitty panelly leafy layouts",
				image: `https://${domain}${favicon}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				devModulePath: await path.version.root("demo/main.bundle.js"),
				prodModulePath: await path.version.root("demo/main.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<lettuce-layout></lettuce-layout>
		`,
	})
})

