
import {View} from "@e280/sly"
import {Panel} from "../studio/types.js"
import {Layout} from "../layout/layout.js"
import {Studio} from "../studio/studio.js"
import {Surface} from "../layout/types.js"

export function reactIntegration<R>({useRef, useState, useEffect, createElement, reactify}: {
		reactify: <Props extends any[]>(slyView: View<Props>) => (...a: any[]) => R
		useRef: <V>(init: V) => {current: V}
		useState: <V>(init: V) => [V, (v: V) => void]
		useEffect: (fn: () => () => void, deps: any[]) => void
		createElement: (tag: string | (() => R), info: {}, children: R | R[]) => R
	}) {

	type ReactPanel = Panel & { render: (surface: Surface) => R }
	type ReactPanels = { [key: string]: ReactPanel }

	function useLettuceLayout<Ps extends ReactPanels>({panels, layout}: {
			panels: Ps
			layout: Layout
		}) {

		function useOnce<R>(fn: () => R) {
			const ref = useRef<R | undefined>(undefined)
			if (ref.current === undefined) ref.current = fn()
			return ref.current!
		}

		const {LettuceDeskRaw, studio} = useOnce(() => {
			const renderer = () => () => {} // opt-out of default lit rendering
			const studio = new Studio({panels, layout, renderer})
			const LettuceDeskRaw = reactify(studio.ui.views.LettuceDesk)
			return {studio, LettuceDeskRaw}
		})

		const [surfaces, setSurfaces] = useState<Surface[]>(studio.layout.surfaces)
		useEffect(() => studio.layout.on(() => setSurfaces(studio.layout.surfaces)), [])

		const LettuceDesk = () => createElement(
			LettuceDeskRaw,
			{ props: [] },
			surfaces.map(surface =>
				createElement(
					'div',
					{ slot: surface.id, 'data-panel': surface.panel },
					studio.panels[surface.panel].render(surface),
				)
			)
		)

		return {LettuceDesk, studio}
	}

	return {useLettuceLayout}
}

