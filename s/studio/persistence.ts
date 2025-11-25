
import {debounce, ev} from "@e280/stz"
import {Kv, StorageDriver, Store} from "@e280/kv"
import {Blueprint} from "../layout/types.js"
import {PersistenceOptions} from "./types.js"

const broadcast = "change"

export class Persistence {
	static localStorageKv = () => new Kv(
		new StorageDriver(window.localStorage)
	)

	store: Store<Blueprint>

	// TODO this funky boolean is questionable...
	#isLoading = false

	constructor(private options: PersistenceOptions) {
		this.store = options.kv.store<Blueprint>(options.key)
	}

	async load() {
		const freshBlueprint = await this.store.get()
		if (freshBlueprint) {
			try {
				this.#isLoading = true
				await this.options.layout.setBlueprint(freshBlueprint)
			}
			finally {
				this.#isLoading = false
			}
		}
	}

	async save() {
		await this.store.set(this.options.layout.getBlueprint())
		this.options.broadcastChannel.postMessage(broadcast)
	}

	setupAutoSave(debounceMs = 250) {
		const debouncedSave = debounce(debounceMs, async() => this.save())
		return this.options.layout.on(() => {
			if (!this.#isLoading)
				debouncedSave()
		})
	}

	setupLoadOnBroadcast() {
		return ev(this.options.broadcastChannel, {
			message: (event: MessageEvent) => {
				if (event.data === broadcast)
					this.load()
			},
		})
	}
}

