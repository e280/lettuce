
import {html} from "lit"
import {LayoutMeta} from "./utils/layout-meta.js"
import {Surface} from "../../../../layout/types.js"

export const renderSurface =
	(_meta: LayoutMeta) =>
	(surface: Surface) => html`

	<slot name="${surface.id}"></slot>
`

