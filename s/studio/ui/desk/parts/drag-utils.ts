import { Dock } from "../../../../layout/types.js"

export function isWithin(target: EventTarget | null, selector: string): HTMLElement | undefined {
	let node = target as HTMLElement | null

	while (node) {
		if (node.matches && node.matches(selector))
			return node

		node = node.parentElement
	}

	return undefined
}

// for getting elements in shadow dom
export const deepHitTest = ({x, y, ignored, predicate}: {
	x: number
	y: number
	ignored: HTMLElement
	predicate: (node: HTMLElement) => any
}): HTMLElement | null => {
	let node: HTMLElement | null =
		document.elementFromPoint(x, y) as HTMLElement | null

	if (!node) return null

	const visited = new Set<HTMLElement>()

	while (node) {
		if (visited.has(node)) break
		visited.add(node)

		if (node !== ignored && !ignored.contains(node)) {
			const result = predicate(node)
			if (result) return result
		}

		const root = node.shadowRoot
		if (!root) break

		const deeper = root.elementFromPoint(x, y) as HTMLElement | null
		if (!deeper || deeper === node) break

		node = deeper
	}

	return null
}


export const getOrigin = (e: PointerEvent) => ({
	x: e.clientX,
	y: e.clientY
})

export const getDockAxis = (dock: Dock) =>
	(dock.taskbarAlignment === 'left' || dock.taskbarAlignment === 'right')
		? 'y'
		: 'x'

export const getAxisBounds = (axis: 'x' | 'y', container: DOMRect, tab: DOMRect) =>
	axis === 'x'
		? {min: container.left - tab.left, max: container.right - tab.right}
		: {min: container.top - tab.top, max: container.bottom - tab.bottom}


export const isPointerInside = (e: PointerEvent, rect: DOMRect) =>
	e.clientX >= rect.left &&
	e.clientX <= rect.right &&
	e.clientY >= rect.top &&
	e.clientY <= rect.bottom

export const outOfBoundsDistance = (e: PointerEvent, r: DOMRect) => {
	const dx =
		e.clientX < r.left ? r.left - e.clientX :
		e.clientX > r.right ? e.clientX - r.right :
		0

	const dy =
		e.clientY < r.top ? r.top - e.clientY :
		e.clientY > r.bottom ? e.clientY - r.bottom :
		0

	return {dx, dy}
}

export const containerRect = (container: HTMLElement | null) =>
	container ? container.getBoundingClientRect() : null
