
import {Builder} from "../builder.js"

export type BasicPanelName = "alpha" | "bravo" | "charlie"

export const basicStock = () => Builder.fn<BasicPanelName>()(b => ({
	empty: () => b.blank(),
	default: () => b.horizontal(1, b.dock(1, "alpha", "bravo", "charlie")),
}))

