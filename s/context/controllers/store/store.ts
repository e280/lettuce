
import {Layout} from "../layout/parts/types.js"
import {json_storage_proxy} from "../../../tools/json_storage_proxy.js"

export type Store = Partial<{
	layout: Layout.File
}>

export function store(storage: Storage) {
	return json_storage_proxy<Store>(storage, "construct_")
}

