
import {html} from "lit"
import {LayoutMeta} from "./layout_meta.js"
import {LayoutNode} from "../../../../../layout/types.js"

export function render_adder_leaf(
		{studio: {layout, panels}}: LayoutMeta,
		pane: LayoutNode.Dock,
	) {

	return html`${Object.entries(panels)
		.map(([name, panel]) => html`
			<button
				@click=${async() => {
					const [, leafIndex] = await layout.actions.addSurface(
						pane.id,
						name as any,
					)
					await layout.actions.setDockActiveSurface(
						pane.id,
						leafIndex,
					)
				}}
				>
				${panel.icon()}
				<span>${panel.label}</span>
			</button>
		`)}`
}

