
import {pubsub} from "@benev/slate"

import {V2} from "../utils/v2.js"
import {Input} from "../input.js"
import {Device} from "../device.js"

export class PointerMovements extends Device {
	dispose: () => void
	movement: V2 = [0, 0]
	coordinates: V2 = [0, 0]

	onInput = pubsub<[Input.Vector]>()

	constructor(target: EventTarget, channel: string) {
		super()

		const listener = (event: PointerEvent) => {
			this.coordinates = [
				event.clientX,
				event.clientY,
			]

			const movement: V2 = [
				event.movementX,
				event.movementY,
			]

			this.movement = movement

			this.onInput.publish({
				kind: "vector",
				vector: movement,
				channel,
			})
		}

		target.addEventListener("pointermove", listener as any)

		this.dispose = () => {
			target.removeEventListener("pointermove", listener as any)
		}
	}
}

