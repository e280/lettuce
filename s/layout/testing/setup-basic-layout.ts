
import {deep} from "@e280/stz"
import {buildStock} from "../build-stock.js"
import {asPanels} from "../../studio/types.js"

const basicPanels = deep.freeze(asPanels({
	alpha: {
		label: "alpha",
		icon: () => "alpha",
		render: () => "alpha",
	},
	bravo: {
		label: "bravo",
		icon: () => "bravo",
		render: () => "bravo",
	},
	charlie: {
		label: "charlie",
		icon: () => "charlie",
		render: () => "charlie",
	},
}))

export const basicStock = () => buildStock<keyof typeof basicPanels>(b => ({
	empty: () => b.blank(),
	default: () => b.cell(b.tabs("alpha", "bravo", "charlie")),
}))

