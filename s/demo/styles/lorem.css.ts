
import {css} from "@benev/slate"
import {standard_panel_styles} from "../../panels/standard_panel_styles.js"
export default css`

${standard_panel_styles}

section {
	font-size: 1.5em;

	display: flex;
	flex-direction: column;
	gap: 1em;
	padding: 1em 2em;
	max-width: 32em;
	margin: auto;

	h1 {
		text-transform: uppercase;
		opacity: 0.2;
	}
}

`

