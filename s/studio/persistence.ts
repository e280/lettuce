
import {debounce} from "@e280/stz"
import {Kv, StorageDriver, Store} from "@e280/kv"
import {Blueprint} from "../layout/types.js"
import {PersistenceOptions} from "./types.js"

export class Persistence {
	static localStorageKv = () => new Kv(
		new StorageDriver(window.localStorage)
	)

	store: Store<Blueprint>

	constructor(private options: PersistenceOptions) {
		this.store = options.kv.store<Blueprint>(options.key)
	}

	async load() {
		const freshBlueprint = await this.store.get()
		if (freshBlueprint)
			await this.options.layout.setBlueprint(freshBlueprint)
	}

	async save() {
		await this.store.set(this.options.layout.getBlueprint())
	}

	setupAutoSave(debounceMs = 250) {
		const debouncedSave = debounce(debounceMs, async() => this.save())
		return this.options.layout.on(() => void debouncedSave())
	}

	setupLoadOnStorageEvent() {
		return StorageDriver.onStorageEvent(() => this.load())
	}
}

