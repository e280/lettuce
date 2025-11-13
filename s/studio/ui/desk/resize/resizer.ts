
import {Layout} from "../../../../layout/layout.js"
import {ResizeOperation} from "./utils/operation.js"
import {Cell, Dock} from "../../../../layout/types.js"
import {calculate_new_size_indicated_by_drag} from "./utils/calculate_new_size_indicated_by_drag.js"

export class Resizer {
	#operation: ResizeOperation | null = null
	constructor(private layout: Layout) {}

	start = (
			node: Cell,
			child: Cell | Dock,
		) => (event: PointerEvent) => {

		const target = event.target as HTMLElement
		const rect = target.parentElement!.getBoundingClientRect()

		this.#operation = {
			node: child,
			parent: node,
			initialSize: child.size,
			x: event.clientX,
			y: event.clientY,
			width: rect.width,
			height: rect.height,
		}
	}

	track_mouse_movement = (event: PointerEvent) => {
		const resize = this.#operation
		if (resize) {
			this.layout.actions.resize(
				resize.node.id,
				calculate_new_size_indicated_by_drag(
					resize,
					event,
				),
			)
		}
	}

	end = () => {
		this.#operation = null
	}
}

