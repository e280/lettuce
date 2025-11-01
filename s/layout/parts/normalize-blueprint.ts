
import {Blueprint, Stock} from "../types.js"

export function normalizeBlueprint({blueprint, currentVersion, stock}: {
		blueprint: Blueprint
		currentVersion: number
		stock: Stock
	}): Blueprint {

	if (blueprint.version !== currentVersion) {
		console.warn(`layout blueprint invalid version (${blueprint.version}), reverting to default stock layout at version (${currentVersion})`)
		return {
			version: currentVersion,
			root: stock.default(),
		}
	}

	return blueprint
}

