
import {ResizeOperation} from "./operation.js"
import {cap_percent, percentage} from "../../../../tools/number_functions.js"

export function calculate_new_size_indicated_by_drag(
		resize: ResizeOperation,
		{clientX, clientY}: PointerEvent,
	) {

	let diff = 0

	if (resize.parent.vertical) {
		const pixels = resize.y - clientY
		diff = percentage(pixels, resize.height)
	}
	else {
		const pixels = resize.x - clientX
		diff = percentage(pixels, resize.width)
	}

	return cap_percent(resize.initial_size - diff)
}

