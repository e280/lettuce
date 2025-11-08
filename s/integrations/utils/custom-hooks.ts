
export const customHooks = ({useRef}: {
		useRef: <V>(init: V) => {current: V}
	}) => ({

	useOnce: <R>(fn: () => R) => {
		const ref = useRef<R | undefined>(undefined)
		if (ref.current === undefined) ref.current = fn()
		return ref.current!
	}
})

