
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
	--tab-active: var(--dock);
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

	&[data-vertical] > .gutter {
		cursor: ns-resize;
	}
}

.gutter {
	flex: 0 0 var(--gutter-size);
	cursor: ew-resize;
	background: var(--gutter);
}

.dock {
	display: flex;
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
			flex: 1;

			.spawn-dropdown {
				display: flex;
				align-items: start;
				flex: 1;

				::part(label) {
					padding: 0.5em;
				}

				.icon {
					color: #8E8E9A;
					display: flex;
				}
			}

			.item {
				display: flex;
			}

			sl-menu {
    		background: #2424285e;
    		backdrop-filter: blur(10px);
			}

			sl-menu-item .icon {
				margin-right: 0.5em;
			}

			sl-dropdown::part(base) {
				display: flex;
				align-items: center;
				background: transparent;
				border: none;
			}

			sl-button {
  			display: flex;
			}

			sl-button::part(base) {
				display: flex;
				align-items: center;
				background: transparent;
				border: none;
			}

			::part(label) {
				display: flex;
				align-items: center;
				justify-content: center;
			}

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

			&:hover:not(:disabled) {
				opacity: 0.9;
				transform: scale(1.1);
				color: var(--highlight);
			}

			&:active:not(:disabled) {
				opacity: 1;
			}

			&:disabled {
				cursor: not-allowed;
				opacity: 0.3;
				transform: none;
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
		transition: transform 120ms cubic-bezier(0.2, 0, 0, 1);
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
		padding-right: 0.3em;
		background: var(--tab);

		opacity: 0.6;
		&:hover { opacity: 1; }
		&:hover:active { color: var(--highlight); }

		&[data-active] {
			opacity: 1;
			color: var(--highlight);
			background: var(--tab-active);
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

/* Alignment specific styles */

.dock[data-taskbar-alignment="top"] {
	flex-direction: column;

	> .taskbar {
		justify-content: space-between;

		.tabs button {
			border-top: 0.1em solid transparent;

			&[data-active] {
				border-color: var(--highlight);
			}
		}
	}
}

.dock[data-taskbar-alignment="right"] {
	> .surface {
		direction: rtl;
	}

	> .taskbar {
		order: 1;
		flex-direction: column;
		align-items: end;
		height: 100%;
		justify-content: space-between;

		.tabs  {
			direction: rtl;
			.tab {
				justify-content: end;
			}
		}

		.tabs, .actions {
			flex-direction: column;
		}

		.tabs button {
			border-left: 0.1em solid transparent;

			&[data-active] {
				border-color: var(--highlight);
			}
		}
	}
}

.dock[data-taskbar-alignment="left"] {
	> .taskbar {
		flex-direction: column;
		align-items: start;
		height: 100%;
		justify-content: space-between;

		.tabs, .actions {
			flex-direction: column;
		}

		.tabs button {
			border-right: 0.1em solid transparent;

			&[data-active] {
				border-color: var(--highlight);
			}
		}
	}
}

.dock[data-taskbar-alignment="bottom"] {
	flex-direction: column;

	> .taskbar {
		order: 1;
		justify-content: space-between;

		.tabs button {
			border-top: 0.1em solid transparent;

			&[data-active] {
				border-color: var(--highlight);
			}
		}
	}
}

.dock[data-taskbar-alignment="top"],
.dock[data-taskbar-alignment="bottom"] {
	&[data-drag] .tabs {
		padding-right: calc(var(--tab-shift-size) + 0.2em);
	}
	.tabs .tab[data-shift="positive"] {
		transform: translateX(var(--tab-shift-size));
	}
	.tabs .tab[data-shift="negative"] {
		transform: translateX(calc(var(--tab-shift-size) * -1));
	}
	.actions {
		> :first-child {
			transform: translateX(calc(var(--tab-shift-size)));
		}
	}
}

.dock[data-taskbar-alignment="left"],
.dock[data-taskbar-alignment="right"] {
	&[data-drag] .tabs {
		padding-bottom: calc(var(--tab-shift-size) + 0.2em);
	}
	.tabs .tab[data-shift="positive"] {
		transform: translateY(var(--tab-shift-size));
	}
	.tabs .tab[data-shift="negative"] {
		transform: translateY(calc(var(--tab-shift-size) * -1));
	}
	.actions {
		> :first-child {
			transform: translateY(calc(var(--tab-shift-size)));
		}
	}

}

.dock[data-dock-drag] .taskbar {
	scale: 1.02;
	box-shadow: 0 8px 22px rgba(0,0,0,0.35);
	cursor: grabbing;
	border-radius: 6px;
	transition: scale 0.12s ease, box-shadow 0.12s ease;
}
}

`
