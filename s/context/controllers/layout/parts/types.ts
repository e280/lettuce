
import {Id} from "../../../../tools/fresh_id.js"

export namespace Layout {
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

	export type Node = (
		| Leaf
		| Pane
		| Cell
	)

	////////

	export type File = {
		version: number,
		root: Cell
	}

	export type Report<N extends Node = Node> = (
		N extends Leaf
			? [N, Pane, number]

		: N extends Pane
			? [N, Cell, number]

		: N extends Cell
			? [N, Cell | null, number]

		: never
	)
}

