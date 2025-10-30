
import {ResizeOperation} from "./operation.js"
import {size_of_resize_handle_in_rem} from "../../style.css.js"

export function calculate_amount_of_container_overflow(
		resize: ResizeOperation,
		size: number,
	) {

	const rem_px = parseFloat(
		getComputedStyle(document.documentElement).fontSize
	)

	const handle_size_px = rem_px * size_of_resize_handle_in_rem

	const handle_size_percent = resize.parent.vertical
		? (handle_size_px / resize.height) * 100
		: (handle_size_px / resize.width) * 100

	const number_of_resize_handles = resize.parent.children.length < 2
		? 0
		: resize.parent.children.length - 1

	const sibling_percent = resize.parent.children
		.filter(node => node !== resize.node)
		.reduce((sum, node) => sum + (node.size ?? 0), 0)

	const resizing_percent = (number_of_resize_handles * handle_size_percent)

	const totalpercent = size + sibling_percent + resizing_percent

	return (totalpercent > 100)
		? totalpercent - 100
		: 0
}

