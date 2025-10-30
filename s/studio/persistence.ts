
import {effect} from "@e280/strata"
import {Kv, StorageDriver} from "@e280/kv"
import {debounce, disposer} from "@e280/stz"
import {Blueprint} from "../layout/types.js"
import {PersistenceOptions} from "./types.js"

const defaults = {
	debounceMs: 250,
	loadOnStorageEvent: true,
}

export class Persistence {
	static setup = async(options: PersistenceOptions) => {
		const {
			layout,
			kv = new Kv(new StorageDriver(window.localStorage)),
			debounceMs = defaults.debounceMs,
		} = options

		const store = kv.store<Blueprint>("lettuceBlueprint")

		const load = async() => {
			const freshBlueprint = await store.get()
			if (freshBlueprint)
				await layout.setBlueprint(freshBlueprint)
		}

		const save = debounce(debounceMs, async() => {
			await store.set(layout.getBlueprint())
		})

		await load()
		return new this(options, load, save)
	}

	dispose = disposer()

	constructor(
			options: PersistenceOptions,
			public load: () => Promise<void>,
			public save: () => Promise<void>,
		) {

		this.dispose.schedule(
			effect(() => options.layout.getBlueprint(), save)
		)

		if (options.loadOnStorageEvent ?? defaults.loadOnStorageEvent)
			this.dispose.schedule(
				StorageDriver.onStorageEvent(load)
			)
	}
}

