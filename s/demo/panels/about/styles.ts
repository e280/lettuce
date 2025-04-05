
import {css} from "@benev/slate"
import {standard_panel_styles} from "../../../panels/standard_panel_styles.js"

export const styles = css`

${standard_panel_styles}

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
}

`

