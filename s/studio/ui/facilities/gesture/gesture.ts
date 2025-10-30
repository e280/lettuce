
import {sub} from "@e280/stz"
import {signal, SignalFn} from "@e280/strata"
import {Focalization} from "./parts/types.js"
// import {Impulse} from "../../../tools/impulse/impulse.js"

export class Gesture {
	// keyboard = new Impulse.Keyboard(window)
	// pointerButtons = new Impulse.PointerButtons(window)
	// pointerMovements = new Impulse.PointerMovements(window, "mouse")

	focal: SignalFn<null | Focalization>
	// pointerLock: Signal<null | PointerLock>
	on_pointer_lock_disengaged = sub<[]>()

	constructor() {
		this.focal = signal<null | Focalization>(null)
		// this.pointerLock = signal(null)
		//
		// const stopPointerLock = () => {
		// 	if (!document.pointerLockElement)
		// 		this.disengage_pointer_lock()
		// }
		//
		// document.addEventListener("pointerlockchange", stopPointerLock)
		// document.addEventListener("pointerlockerror", stopPointerLock)

		// this.add(
		// 	this.keyboard,
		// 	this.pointerButtons,
		// 	this.pointerMovements,
		// )
	}

	// engage_pointer_lock(lock: PointerLock, on_disengaged = () => {}) {
	// 	if (this.pointerLock.value || document.pointerLockElement)
	// 		throw new Error("invalid double pointerlock")
	// 	this.on_pointer_lock_disengaged.once(on_disengaged)
	// 	this.pointerLock.value = lock
	// 	lock.element.requestPointerLock()
	// }
	//
	// disengage_pointer_lock() {
	// 	document.exitPointerLock()
	// 	this.pointerLock.value = null
	// 	this.on_pointer_lock_disengaged.publish()
	// }
}

