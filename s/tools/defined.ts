
export function defined<X, Y>(x: X, act: {
		yes: (x: NonNullable<X>) => Y
		no: () => Y
	}) {

	return (x === undefined || x === null)
		? act.no()
		: act.yes(x!)
}

