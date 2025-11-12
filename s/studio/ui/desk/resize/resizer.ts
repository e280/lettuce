
import {Layout} from "../../../../layout/layout.js"
import {ResizeOperation} from "./utils/operation.js"
import {Cell, Dock} from "../../../../layout/types.js"
import {calculate_new_size_indicated_by_drag} from "./utils/calculate_new_size_indicated_by_drag.js"
import {calculate_amount_of_container_overflow} from "./utils/calculate_amount_of_container_overflow.js"

export class Resizer {
	#operation: ResizeOperation | null = null
	constructor(private layout: Layout) {}

	start = (
			node: Cell,
			child: Cell | Dock,
			index: number,
		) => (event: PointerEvent) => {

		const target = event.target as HTMLElement
		const rect = target.parentElement!.getBoundingClientRect()
		const next = node.children.at(index + 1)

		this.#operation = {
			node: child,
			parent: node,
			initialSize: child.size,
			next: next
				? {node: next, initialSize: next.size}
				: null,
			x: event.clientX,
			y: event.clientY,
			width: rect.width,
			height: rect.height,
		}
	}

	track_mouse_movement = (event: PointerEvent) => {
		const resize = this.#operation

		if (resize) {
			const proposed_size = calculate_new_size_indicated_by_drag(
				resize,
				event,
			)

			const leakage = calculate_amount_of_container_overflow(
				resize,
				proposed_size,
			)

			const new_size = proposed_size - leakage

			this.layout.actions.resize(resize.node.id, new_size)
		}
	}

	end = () => {
		this.#operation = null
	}
}

