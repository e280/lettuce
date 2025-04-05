
import {css} from "@benev/slate"
import {standard_panel_styles} from "../../../panels/standard_panel_styles.js"

export const styles = css`

${standard_panel_styles}

.logo {
	display: flex;
	justify-content: center;
	width: 100%;
	height: 100%;

	> svg {
		width: 20em;
		max-width: 100%;
		max-height: 100%;
	}
}

`

