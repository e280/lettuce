
import {Content} from "@e280/sly"
import {Trunk} from "@e280/strata"

export type Id = string

export type LayoutOptions = {
	stock: LayoutStock
}

export type LayoutTree = Trunk<{root: LayoutNode.Cell}>

export interface PanelProps {
	leafId: Id
}

export interface PanelSpec {
	label: string
	icon: () => Content
	render: (props: PanelProps) => Content
}

export interface PanelSpecs {
	[key: string]: PanelSpec
}

export function panel(t: PanelSpec) {
	return t
}

export namespace LayoutNode {
	export type Kind = "cell" | "pane" | "leaf"

	export interface Base {
		kind: Kind
	}

	export interface Leaf {
		id: Id
		kind: "leaf"
		panel: string
	}

	export interface Pane {
		id: Id
		kind: "pane"
		children: Leaf[]
		size: number | null
		active_leaf_index: number | null
	}

	export interface Cell {
		id: Id
		kind: "cell"
		children: (Cell | Pane)[]
		vertical: boolean
		size: number | null
	}

	export type Any = (
		| Leaf
		| Pane
		| Cell
	)
}

export type LayoutFile = {
	version: number,
	root: LayoutNode.Cell
}

export type LayoutReport<N extends LayoutNode.Any = LayoutNode.Any> = (
	N extends LayoutNode.Leaf
		? [N, LayoutNode.Pane, number]

	: N extends LayoutNode.Pane
		? [N, LayoutNode.Cell, number]

	: N extends LayoutNode.Cell
		? [N, LayoutNode.Cell | null, number]

	: never
)

export type LayoutStock = {
	empty: () => LayoutNode.Cell
	default: () => LayoutNode.Cell
}

