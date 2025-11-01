
import {Cell, Dock} from "../types.js"

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

export function clear_size_of_last_child(node: Cell) {
	const last = node.children.at(-1)
	if (last)
		last.size = null
}

export function ensure_active_index_is_in_safe_range(dock: Dock) {
	dock.activeChildIndex = dock.activeChildIndex === null
		? null
		: dock.activeChildIndex > (dock.children.length - 1)
			? null
			: dock.activeChildIndex
}

