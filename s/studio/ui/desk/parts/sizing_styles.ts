
export function sizing_styles(size: number | null) {
	return size !== null
		? `flex: 0 0 ${size}%;`
		: `flex: 1 1 auto;`
}

