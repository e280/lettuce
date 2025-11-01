
import {hex} from "@e280/stz"

export function freshId() {
	return hex.random(32)
}

