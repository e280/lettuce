
export function clamp(x: number, min = 0, max = 1) {
	x = Math.max(x, min)
	x = Math.min(x, max)
	return x
}

