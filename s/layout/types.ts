
import {Trunk} from "@e280/strata"

export type Id = string

export type LayoutOptions = {
	stock: LayoutStock
}

export type Blueprint = {root: LayoutNode.Cell}
export type BlueprintTree = Trunk<Blueprint>

export namespace LayoutNode {
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
	export type Any = Cell | Dock | Surface
}

export type LayoutFile = {
	version: number,
	root: LayoutNode.Cell
}

export type LayoutReport<N extends LayoutNode.Any = LayoutNode.Any> = {
	node: N
	index: number
	path: (LayoutNode.Cell | LayoutNode.Dock)[]
}

export type LayoutParent<N extends LayoutNode.Any = LayoutNode.Any> = (
	N extends LayoutNode.Surface
		? LayoutNode.Dock

	: N extends LayoutNode.Dock
		? LayoutNode.Cell

	: N extends LayoutNode.Cell
		? LayoutNode.Cell | undefined

	: LayoutNode.Container
)

export type LayoutStock = {
	empty: () => LayoutNode.Cell
	default: () => LayoutNode.Cell
}

