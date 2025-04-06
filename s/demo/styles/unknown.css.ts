
import {css} from "@benev/slate"
import {standard_panel_styles} from "../../panels/standard_panel_styles.js"
export default css`

${standard_panel_styles}

:host {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

h1 {
	font-size: 2em;
	text-transform: uppercase;
	opacity: 0.2;
	text-align: center;
}

`

