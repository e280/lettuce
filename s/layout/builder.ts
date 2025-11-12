
import {Cell, Dock} from "./types.js"
import {freshId} from "../tools/fresh-id.js"
import { redistribute_child_sizes_fairly } from "./parts/action-utils.js"

export class Builder<K extends string = string> {
	static fn = <K extends string = string>() => (
		<R>(fn: (builder: Builder<K>) => R) => fn(new Builder())
	)

	dock = (size: number, ...panels: K[]): Dock => ({
		kind: "dock",
		id: freshId(),
		size,
		activeChildIndex: panels.length === 0
			? null
			: 0,
		children: panels.map(panel => ({
			kind: "surface",
			id: freshId(),
			panel: panel as string,
		})),
	})

	horizontal = (size: number, ...children: (Cell | Dock)[]): Cell => redistribute_child_sizes_fairly({
		kind: "cell",
		id: freshId(),
		size,
		vertical: false,
		children,
	})

	vertical = (size: number, ...children: (Cell | Dock)[]): Cell => redistribute_child_sizes_fairly({
		kind: "cell",
		id: freshId(),
		size,
		vertical: true,
		children,
	})

	blank = () => this.horizontal(1, this.dock(1))
	singleton = (panel: K) => this.horizontal(100, this.dock(1, panel))

	setup = <R>(fn: (stocker: Builder<K>) => R) => fn(this)
}

