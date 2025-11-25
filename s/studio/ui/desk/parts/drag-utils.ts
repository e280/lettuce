import {Dock} from "../../../../layout/types.js"

export function isWithin(target: EventTarget | null, selector: string): HTMLElement | undefined {
	let node = target as HTMLElement | null

	while (node) {
		if (node.matches && node.matches(selector))
			return node

		node = node.parentElement
	}

	return undefined
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
