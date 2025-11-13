
import {Container, Dock} from "../types.js"
import {clamp} from "../../tools/numerical.js"

export function movement_is_within_same_dock(
		sourceDock: Dock,
		destinationDock: Dock,
	) {
	return sourceDock.id === destinationDock.id
}

export function same_place(
		sourceIndex: number,
		destinationIndex: number,
	) {
	return (
		sourceIndex === destinationIndex ||
		sourceIndex === (destinationIndex - 1)
	)
}

export function movement_is_forward(
		sourceIndex: number,
		destinationIndex: number,
	) {
	return sourceIndex < destinationIndex
}

export function get_active_surface(dock: Dock) {
	return dock.activeChildIndex !== null
		? dock.children[dock.activeChildIndex]
		: null
}

export function last_child_is_active(dock: Dock) {
	return dock.activeChildIndex === (dock.children.length - 1)
}

export function activate_last_child(dock: Dock) {
	dock.activeChildIndex = dock.activeChildIndex === null
		? null
		: Math.max(0, dock.activeChildIndex - 1)
}

export function maintain_which_surface_is_active(dock: Dock, fn: () => void) {
	const reapply = remember_which_surface_is_active(dock)
	fn()
	reapply()
}

export function remember_which_surface_is_active(dock: Dock) {
	const originalIndex = dock.activeChildIndex
	const activeSurfaceId = get_active_surface(dock)?.id

	return () => {
		if (activeSurfaceId === null)
			dock.activeChildIndex = null
		else {
			const newIndex = dock.children
				.findIndex(surface => surface.id === activeSurfaceId)
			dock.activeChildIndex = (newIndex === -1)
				? originalIndex
				: newIndex
			ensure_active_index_is_in_safe_range(dock)
		}
	}
}

export function parent(path: number[]) {
	return path.slice(0, path.length - 1)
}

export function redistribute_child_sizes_fairly(children: Container[]) {
	const total = children.reduce((sum, c) => sum + c.size, 0)
	if (total === 0) {
		const even = 1 / children.length
		for (const c of children) c.size = even
		return children
	}
	for (const c of children) {
		c.size = clamp(c.size / total)
	}
	return children
}

export function redistribute_child_sizes_locally(children: Container[]) {
	let tally = 0
	for (const child of children) {
		tally += child.size
		if (tally > 1) child.size -= tally - 1
		child.size = clamp(child.size)
	}
	const last = children.at(-1)
	if (tally < 1 && last) last.size = clamp(last.size + (1 - tally))
	return children
}

export function ensure_active_index_is_in_safe_range(dock: Dock) {
	dock.activeChildIndex = dock.activeChildIndex === null
		? null
		: dock.activeChildIndex > (dock.children.length - 1)
			? null
			: dock.activeChildIndex
}

