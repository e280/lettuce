
export function isWithin(target: EventTarget | null, selector: string): HTMLElement | undefined {
	let node = target as HTMLElement | null

	while (node) {
		if (node.matches && node.matches(selector))
			return node

		node = node.parentElement
	}

	return undefined
}

