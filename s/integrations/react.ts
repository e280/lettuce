
import {View} from "@e280/sly"
import {Panel} from "../studio/types.js"
import {Studio} from "../studio/studio.js"
import {Surface} from "../layout/types.js"
import {customHooks} from "./utils/custom-hooks.js"

export function reactIntegration<R>({useRef, useState, useEffect, createElement, reactify}: {
		reactify: <Props extends any[]>(slyView: View<Props>) => (...a: any[]) => R
		useRef: <V>(init: V) => {current: V}
		useState: <V>(init: V) => [V, (v: V) => void]
		useEffect: (fn: () => () => void, deps: any[]) => void
		createElement: (tag: string | (() => R), info: {}, children: R | R[]) => R
	}) {

	type ReactPanel = Panel & { render: (surface: Surface) => R }
	type ReactPanels = { [key: string]: ReactPanel }
	const {useOnce} = customHooks({useRef})

	// opt-out of default lit rendering
	const renderer = () => () => {}

	const useDeskComponent = <Ps extends ReactPanels>(studio: Studio<Ps>) => {
		const LettuceDeskRaw = useOnce(() => reactify(studio.ui.views.LettuceDesk))
		const [surfaces, setSurfaces] = useState<Surface[]>(studio.layout.surfaces)
		useEffect(() => studio.layout.on(() => setSurfaces(studio.layout.surfaces)), [])
		return () => createElement(
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
	}

	return {renderer, useDeskComponent}
}

