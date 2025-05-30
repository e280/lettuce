
import {V2} from "./utils/v2.js"

export namespace Input {
	export type Kind = "button" | "vector"
	export type Modifiers = {
		ctrl: boolean
		meta: boolean
		alt: boolean
		shift: boolean
	}

	export interface Base {
		kind: Kind
	}

	export interface Button extends Base {
		kind: "button"
		code: string
		down: boolean
		mods: Modifiers
		repeat: boolean
	}

	export interface Vector extends Base {
		kind: "vector"
		channel: string
		vector: V2
	}

	export type Whatever = Button | Vector
}

