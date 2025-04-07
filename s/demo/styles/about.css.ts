
import {css} from "@benev/slate"
export default css`

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
}

`

