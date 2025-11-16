
import {Kv} from "@e280/kv"
import {Content} from "@e280/sly"

import type {Studio} from "./studio.js"
import {Layout} from "../layout/layout.js"
import {Id, Surface, Dock} from "../layout/types.js"

export type Renderer = (desk: HTMLElement) => (surfaces: Surface[]) => void

export type StandardButtonKey =
	| "closeDock"
	| "splitHorizontal"
	| "splitVertical"
	| "spawnPanel"
	| "resetLayout"

export type DockContext = {
	studio: Studio<any>
	dock: Dock
}

export type DockButtonsFn = (context: DockContext) => Content
export type StandardButtons = Record<StandardButtonKey, DockButtonsFn>

export type StudioOptions<Ps extends Panels> = {
	layout: Layout
	panels: Ps
	renderer: Renderer
	buttons?: DockButtonsFn
}

export type PersistenceOptions = {
	layout: Layout
	kv: Kv
	key: string
}

export type Panel = {
	label: string
	icon: (ctx: DockContext) => Content
	limit?: number
}

export type Panels = {
	[key: string]: Panel
}

export function asPanel(s: Panel) {
	return s
}

export function asPanels<Ps extends Panels>(s: Ps) {
	return s
}

export type Focal = {
	dockId: Id
	surfaceId: Id | null
}

export type LitPanel = Panel & {
	render: (surface: Surface) => Content
}

export type LitPanels = {
	[key: string]: LitPanel
}

export function asLitPanel<P extends LitPanel>(s: P) {
	return s
}

export function asLitPanels<Ps extends LitPanels>(s: Ps) {
	return s
}

