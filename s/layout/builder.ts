
import {Cell, Dock} from "./types.js"
import {freshId} from "../tools/fresh-id.js"

export class Builder<K extends string = string> {
	static fn = <K extends string = string>() => (
		<R>(fn: (builder: Builder<K>) => R) => fn(new Builder())
	)

	tabs = (...panels: K[]): Dock => ({
		kind: "dock",
		id: freshId(),
		size: null,
		activeChildIndex: panels.length === 0
			? null
			: 0,
		children: panels.map(panel => ({
			kind: "surface",
			id: freshId(),
			panel: panel as string,
		})),
	})

	cell = (...children: (Cell | Dock)[]): Cell => ({
		kind: "cell",
		id: freshId(),
		size: null,
		vertical: false,
		children,
	})

	horizontal = this.cell

	vertical = (...children: (Cell | Dock)[]): Cell => ({
		kind: "cell",
		id: freshId(),
		size: null,
		vertical: true,
		children,
	})

	blank = () => this.cell(this.tabs())
	singleton = (panel: K) => this.cell(this.tabs(panel))

	setup = <R>(fn: (stocker: Builder<K>) => R) => fn(this)
}

