
import {html} from "lit"
import {LayoutMeta} from "./utils/layout_meta.js"
import {LayoutNode} from "../../../../layout/types.js"

export const render_leaf =
	(_meta: LayoutMeta) =>
	(leaf: LayoutNode.Surface) => html`

	<slot name="leaf-${leaf.id}"></slot>
`

