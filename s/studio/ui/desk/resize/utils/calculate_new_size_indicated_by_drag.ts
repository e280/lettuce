
import {ResizeOperation} from "./operation.js"
import {clamp} from "../../../../../tools/numerical.js"

export function calculate_new_size_indicated_by_drag(
		resize: ResizeOperation,
		{clientX, clientY}: PointerEvent,
	) {

	let diff = 0

	if (resize.parent.vertical) {
		const pixels = resize.y - clientY
		diff = pixels / resize.height
	}
	else {
		const pixels = resize.x - clientX
		diff = pixels / resize.width
	}

	return clamp(resize.initialSize - diff)
}

