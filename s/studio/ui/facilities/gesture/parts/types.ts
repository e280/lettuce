
import {Id} from "../../../../../layout/types.js"

export type Focalization = {
	paneId: Id
	leafId: Id | null
}

export type PointerLock = {
	element: HTMLElement
	leafId?: Id
}

