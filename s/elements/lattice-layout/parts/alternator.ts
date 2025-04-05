
export function alternator<A, B, C>(
		array: A[],
		itemize: (item: A, index: number) => B,
		between: (previous: A, index: number) => C,
	) {

	const end_index = array.length - 1
	const results: (B | C)[] = []

	array.forEach((item, index) => {
		results.push(itemize(item, index))
		if (index !== end_index)
			results.push(between(item, index))
	})

	return results
}

