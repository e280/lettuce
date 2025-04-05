
import {html} from "lit"

import {LayoutMeta} from "./utils/layout_meta.js"
import {Layout} from "../../../context/controllers/layout/parts/types.js"

export const render_leaf = (_: LayoutMeta) => (
		leaf: Layout.Leaf,
	) => html`

	<slot name="leaf-${leaf.id}"></slot>
`

