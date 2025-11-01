
import {Trunk} from "@e280/strata"

export type Id = string

export type LayoutOptions = {
	stock: Stock
}

export type Blueprint = {
	version: number
	root: Cell
}

export type BlueprintTree = Trunk<Blueprint>

export type Kind = "cell" | "dock" | "surface"

/** groups of things, stacked horizontally or vertically */
export type Cell = {
	id: Id
	kind: "cell"
	vertical: boolean
	size: number | null
	children: (Cell | Dock)[]
}

/** contains surfaces, has control ui for tabbing and splitting etc */
export type Dock = {
	id: Id
	kind: "dock"
	size: number | null
	children: Surface[]
	activeChildIndex: number | null
}

/** end-zone location to render a panel onto */
export type Surface = {
	id: Id
	kind: "surface"
	panel: string
}

export type Container = Cell | Dock
export type LayoutNode = Cell | Dock | Surface

export type WalkReport<N extends LayoutNode = LayoutNode> = {
	node: N
	index: number
	path: (Cell | Dock)[]
}

export type ParentOf<N extends LayoutNode = LayoutNode> = (
	N extends Surface
		? Dock

	: N extends Dock
		? Cell

	: N extends Cell
		? Cell | undefined

	: Container
)

export type Stock = {
	default: () => Cell
	empty: () => Cell
}

