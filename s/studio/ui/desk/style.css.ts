
import {css} from "lit"
export default css`

:host {
	display: block;
	width: 100%;
	height: 100%;

	color: #fff8;
	background: #111;
	font-family: sans-serif;

	--scale: 1.5em;
	--gutter-size: 0.7em;
	--highlight: yellow;
	--special: aqua;
	--dropcover: 10%;
	--warn: red;
	--warntext: white;
	--dock: #181818;
	--taskbar: #181818;
	--tab: transparent;
	--gutter: #000;
	--focal: transparent;
	--pointerlock: yellow;
}

.layout {
	user-select: none;
	overflow: hidden;

	display: flex;
	width: 100%;
	height: 100%;

	&[data-dropzone-indicator]::before {
		content: "";
		display: block;
		position: fixed;
		inset: 0;
		z-index: 10;
		background: color-mix(in srgb, transparent, var(--special) var(--dropcover));
		border: 0.25em dashed color-mix(in srgb, transparent, var(--special) 50%);
		pointer-events: none;
	}

	> .cell {
		flex-basis: 100%;
	}
}

.cell {
	display: flex;
	width: 100%;
	height: 100%;

	&[data-vertical] {
		flex-direction: column;
	}

	> * {
		flex: 0 0 auto;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	&[data-vertical] > .resizer {
		cursor: ns-resize;
	}
}

.resizer {
	flex: 0 0 var(--gutter-size);
	cursor: ew-resize;
	background: var(--gutter);
}

.dock {
	display: flex;
	flex-direction: column;
	background: var(--taskbar);
	position: relative;

	border: 1px solid transparent;

	&[data-is-focal] {
		border-color: var(--focal);
	}

	&[data-is-pointer-locked] {
		border-color: var(--pointerlock);
	}

	&[data-drag]::after {
		content: "";
		display: block;
		position: absolute;
		inset: 0;
		border: 0.2em dashed color-mix(in srgb, transparent, var(--special) 50%);
		background: color-mix(in srgb, transparent, var(--special) var(--dropcover));
		pointer-events: none;
	}

	> .taskbar {
		display: flex;
		justify-content: end;
		font-size: var(--scale);

		> * {
			flex: 0 0 auto;
			display: flex;

			> button {
				border: none;
				border-radius: 0;
				background: transparent;

				opacity: 0.6;
				&:hover { opacity: 1; }
				&:hover:active { color: var(--highlight); }
			}
		}

		> .tabs {
			flex: 0 0 auto;
			display: flex;
			flex-direction: row;
		}

		.actions {
			margin-left: auto;

			> button {
				padding: 0.2em 0.3em;

				&.x:hover { color: var(--warn); }
				&.x:hover:active { color: color-mix(in srgb, var(--warntext), var(--warn)); }

				> svg {
					width: 1em;
					height: 1em;
				}
			}
		}
	}

	> .surface {
		position: relative;
		flex: 1 1 auto;
		display: block;
		padding: 0.5em;
		background: var(--dock);
	}

	> .panel {
		user-select: text;
	}

	> .adder {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2em, 4em));
		justify-content: start;
		align-content: start;
		gap: 1em;

		> button {
			opacity: 0.6;
			display: flex;
			flex-direction: column;
			align-items: center;
			transition:
				transform 100ms cubic-bezier(0.34, 1.56, 0.64, 1),
				color 200ms linear;
			transform: scale(1.0);

			&:hover {
				opacity: 0.9;
				transform: scale(1.1);
				color: var(--highlight);
			}

			&:active {
				opacity: 1;
			}

			> svg {
				width: 2em;
				height: 2em;
			}
		}
	}
}

::slotted(*) {
	display: block;
	position: absolute;
	inset: 0;
	overflow: auto;
}

.tabs {
	.tab {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.insert-indicator {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 2px;
		background: var(--special);
		border-radius: 1em;
		pointer-events: none;

		opacity: 0;
		&[data-drag] { opacity: 1; }
	}

	& button {
		display: flex;
		align-items: center;

		border: none;
		border-radius: 0;

		gap: 0.1em;
		padding: 0.2em;
		padding-left: 0.3em;
		padding-right: 0.1em;
		background: var(--tab);
		border-top: 0.1em solid transparent;

		&[data-adder] {
			padding-right: 0.9em;
			&:not(:hover):not([data-active]) {
				opacity: 0.2;
			}
		}

		opacity: 0.6;
		&:hover { opacity: 1; }
		&:hover:active { color: var(--highlight); }

		&[data-active] {
			opacity: 1;
			color: var(--highlight);
			border-color: var(--highlight);
			background: var(--dock);
		}

		> .icon {
			position: relative;
			width: 1em;
			height: 1em;
		}

		> .x {
			opacity: 0.3;
			position: relative;
			width: 0.7em;
			height: 0.7em;

			&[data-available]:hover {
				opacity: 1;
				color: var(--warntext);
				background: var(--warn);
				border-radius: 1em;
			}
		}

		& svg {
			pointer-events: none;
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
		}
	}
}

`

