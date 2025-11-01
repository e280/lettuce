
import {Id} from "../../../../layout/types.js"

export type Focalization = {
	dockId: Id
	surfaceId: Id | null
}

export type PointerLock = {
	element: HTMLElement
	surfaceId?: Id
}

