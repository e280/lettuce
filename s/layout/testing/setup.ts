
import {Builder} from "../builder.js"

export type BasicPanelName = "alpha" | "bravo" | "charlie"

export const basicStock = () => Builder.fn<BasicPanelName>()(b => ({
	empty: () => b.blank(),
	default: () => b.horizontal(0, b.dock(0, "alpha", "bravo", "charlie")),
}))

