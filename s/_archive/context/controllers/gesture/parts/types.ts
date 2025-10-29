
import {Id} from "../../../../tools/fresh_id.js"

export type Focalization = {
	paneId: Id
	leafId: Id | null
}

export type PointerLock = {
	element: HTMLElement
	leafId?: Id
}

