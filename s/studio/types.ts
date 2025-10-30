
import {Kv} from "@e280/kv"
import {Content} from "@e280/sly"
import {Id} from "../layout/types.js"
import {Layout} from "../layout/layout.js"

export type StudioOptions<PS extends PanelSpecs> = {
	panels: PS
	layout: Layout
}

export type PersistenceOptions = {
	layout: Layout
	kv?: Kv
	debounceMs?: number
	loadOnStorageEvent?: boolean
}

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

export function asPanel(s: PanelSpec) {
	return s
}

export function asPanels<PS extends PanelSpecs>(s: PS) {
	return s
}

