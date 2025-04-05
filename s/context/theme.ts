
import {css} from "@benev/slate"

export const theme = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;

	scrollbar-width: thin;
	scrollbar-color: #333 transparent;
}

a {
	color: var(--link);
	text-decoration: none;

	&:visited {
		color: color-mix(in srgb, purple, var(--link) 70%);
	}

	&:hover {
		color: color-mix(in srgb, white, var(--link) 90%);
		text-decoration: underline;
	}

	&:active {
		color: color-mix(in srgb, white, var(--link) 50%);
	}
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
::-webkit-scrollbar-thumb:hover { background: #444; }

button {
	font: inherit;
	color: inherit;
	border: none;
	border-radius: 0.2em;
	background: transparent;
}

button.based {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	gap: 0.3em;
	padding: 0.1em 0.2em;

	background: transparent;
	border: 1px solid color-mix(in srgb, currentColor, transparent 80%);
	background: color-mix(in srgb, currentColor, transparent 90%);

	> svg {
		width: 1em;
		height: 1em;
	}

	&:hover {
		border-color: color-mix(in srgb, currentColor, transparent 70%);
		background: color-mix(in srgb, currentColor, transparent 90%);
	}

	&:hover:active {
		border-color: color-mix(in srgb, currentColor, transparent 60%);
		background: color-mix(in srgb, currentColor, transparent 85%);
	}

	&[disabled] {
		opacity: 0.2;
	}
}

`

