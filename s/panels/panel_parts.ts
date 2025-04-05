
import {Id} from "../tools/fresh_id.js"
import {SVGTemplateResult, LightView} from "@benev/slate"

export interface PanelProps {
	leafId: Id
}

export interface PanelSpec {
	label: string
	icon: SVGTemplateResult
	view: LightView<[PanelProps]>
}

export interface PanelSpecs {
	[key: string]: PanelSpec
}

export function panel(t: PanelSpec) {
	return t
}

