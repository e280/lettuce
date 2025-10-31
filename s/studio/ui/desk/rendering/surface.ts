
import {html} from "lit"
import {LayoutMeta} from "./utils/layout-meta.js"
import {LayoutNode} from "../../../../layout/types.js"

export const renderSurface =
	(_meta: LayoutMeta) =>
	(surface: LayoutNode.Surface) => html`

	<slot name="surface-${surface.id}"></slot>
`

