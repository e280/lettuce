
import {Stock} from "./types.js"
import {Builder} from "./builder.js"

export function buildStock<K extends string>(fn: (builder: Builder<K>) => Stock) {
	return fn(new Builder())
}

