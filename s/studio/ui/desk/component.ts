
import {css, html} from "lit"
import {view} from "@e280/sly"
import {Studio} from "../../studio.js"

export const Desk = ({studio}: {studio: Studio<any>}) => (
	view(use => () => {
		use.styles(css`p {color: green}`)

		return html`
			<p>LETTUCE DESK</p>
		`
	})
)

