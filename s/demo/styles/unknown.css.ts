
import {css} from "@benev/slate"
import {panelStyles} from "../../context/panels/panel-styles.js"
export default css`

${panelStyles}

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

