
import {Id} from "../../tools/fresh_id.js"
import {Content} from "@benev/slate"

export interface PanelProps {
	leafId: Id
}

export interface PanelSpec {
	label: string
	icon: () => Content
	render: (props: PanelProps) => Content
}

export interface PanelSpecs {
	[key: string]: PanelSpec
}

export function panel(t: PanelSpec) {
	return t
}

