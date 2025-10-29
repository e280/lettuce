
import {pubsub} from "@benev/slate"
import {Input} from "./input.js"

export abstract class Device {
	onInput = pubsub<[Input.Whatever]>()
	abstract dispose: () => void
}

