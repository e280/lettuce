
import {css, html} from "lit"
import {view} from "@e280/sly"
import {Layout} from "../logic/layout.js"

export const LettuceLayout = ({layout}: {layout: Layout<any>}) => (
	view(use => () => {
		use.styles(css`p {color: green}`)

		return html`
			<p>LAYOUT</p>
		`
	})
)

