
import {css, html} from "lit"
import {cssReset, view} from "@e280/sly"
import {getMetaVersion} from "../../../tools/get-meta-version.js"

export const AboutPanel = view(use => ({resetLayout}: {resetLayout: () => void}) => {
	use.css(cssReset, style)

	const version = use.once(() => getMetaVersion())

	return html`
		<div class=plate>
			<img alt="" src="/assets/lettuce.avif"/>
			<h2><span>lettuce</span> <span>v${version}</span></h2>
			<p>a leafy panelling ui system for cool apps</p>
			<p>go to the github, nerd: <a href="http://github.com/e280/lettuce#readme">github.com/e280/lettuce</a></p>
			<button @click="${resetLayout}">reset layout</button>
		<div>
	`
})

const style = css`
	.plate {
		font-size: 1.5em;

		padding: 2em;
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1em;

		& img {
			max-width: 100%;
			width: 10em;
		}

		h2 {
			> span:nth-child(1) { color: var(--highlight); }
			> span:nth-child(2) { font-weight: normal; opacity: 0.4; }
		}

		button {
			padding: 0.5em;
		}
	}
`

