
export function cap(x: number, min: number, max: number) {
	return (x < min)
		? min
		: (x > max)
			? max
			: x
}

export function capPercent(x: number) {
	return cap(x, 0, 100)
}

export function percentage(x: number, total: number) {
	return (x / total) * 100
}

