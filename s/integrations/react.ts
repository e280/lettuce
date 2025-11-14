
import {View} from "@e280/sly"
import {Panels} from "../studio/types.js"
import {Studio} from "../studio/studio.js"
import {Surface} from "../layout/types.js"
import {customHooks} from "./utils/custom-hooks.js"

export function reactIntegration<RNode>({useRef, useState, useEffect, createElement, reactify}: {
		reactify: <Props extends any[]>(slyView: View<Props>) => (...a: any[]) => RNode
		useRef: <V>(init: V) => {current: V}
		useState: <V>(init: V) => [V, (v: V) => void]
		useEffect: (fn: () => () => void, deps: any[]) => void
		createElement: (tag: string | (() => RNode), info: {}, children: RNode | RNode[]) => RNode
	}) {

	const {useOnce} = customHooks({useRef})

	// opt-out of default lit rendering
	const renderer = () => () => {}

	function makeDeskComponent<Ps extends Panels>(studio: Studio<Ps>) {
		const LettuceDeskRaw = reactify(studio.ui.views.LettuceDesk)

		return ({render}: {render: (surface: {panel: keyof Ps} & Surface) => RNode}) => {
			const [surfaces, setSurfaces] = useState<Surface[]>(studio.layout.surfaces)
			useEffect(() => studio.layout.on(() => setSurfaces(studio.layout.surfaces)), [])
			return createElement(
				LettuceDeskRaw,
				{props: []},
				surfaces.map(surface =>
					createElement(
						"div",
						{slot: surface.id, "data-panel": surface.panel},
						render(surface),
					)
				)
			)
		}
	}

	return {renderer, makeDeskComponent, useOnce}
}

