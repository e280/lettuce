
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

	export type Any = (
		| Cell
		| Dock
		| Surface
	)
}

export type LayoutFile = {
	version: number,
	root: LayoutNode.Cell
}

export type LayoutReport<N extends LayoutNode.Any = LayoutNode.Any> = (
	N extends LayoutNode.Surface
		? [node: N, parent: LayoutNode.Dock, index: number]

	: N extends LayoutNode.Dock
		? [node: N, parent: LayoutNode.Cell, index: number]

	: N extends LayoutNode.Cell
		? [node: N, parent: LayoutNode.Cell | null, index: number]

	: never
)

export type LayoutStock = {
	empty: () => LayoutNode.Cell
	default: () => LayoutNode.Cell
}

