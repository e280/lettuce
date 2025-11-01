
import {buildStock} from "../build-stock.js"

export type BasicPanelName = "alpha" | "bravo" | "charlie"

export const basicStock = () => buildStock<BasicPanelName>(b => ({
	empty: () => b.blank(),
	default: () => b.cell(b.tabs("alpha", "bravo", "charlie")),
}))

