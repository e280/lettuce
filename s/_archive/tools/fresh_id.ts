
import {Hex} from "@benev/slate"

export type Id = string

export function freshId() {
	return Hex.random()
}

