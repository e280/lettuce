import {signal, SignalFn} from "@e280/strata"

import {Dock, Id, TaskbarAlignment} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"
import {Actions} from "../../../../layout/parts/actions.js"
import {Explorer} from "../../../../layout/parts/explorer.js"

export type TaskbarDragOperation = {
	dockId: Id
	grippingAlignment: TaskbarAlignment | null
}

type PointerPoint = {x: number; y: number}
type PanelBox = {left: number; top: number; width: number; height: number}

export class TaskbarDragger {
	#operation: SignalFn<TaskbarDragOperation | undefined>
	#explorer: Explorer
	#actions: Actions

	constructor(layout: Layout) {
		this.#explorer = layout.explorer
		this.#actions = layout.actions
		this.#operation = signal<TaskbarDragOperation | undefined>(undefined)
	}

	isDragging() {
		return !!this.#operation.value
	}

	isDraggingDock(dockId: Id) {
		const op = this.#operation.value
		return !!op && op.dockId === dockId
	}

	start(dockId: Id) {
		this.#explorer.docks.require(dockId)

		this.#operation.value = {
			dockId,
			grippingAlignment: null,
		}
	}

	updatePreview(alignment: TaskbarAlignment | null) {
		const operation = this.#operation.value
		if (!operation)
			return

		if (operation.grippingAlignment === alignment)
			return

		this.#operation.value = {
			...operation,
			grippingAlignment: alignment,
		}
	}

	cancel() {
		if (!this.#operation.value)
			return

		this.#operation.value = undefined
	}

	async drop() {
		const operation = this.#operation.value
		if (!operation)
			return false

		const dock = this.#explorer.docks.require(operation.dockId)
		const alignment = this.previewAlignment(dock)

		this.#operation.value = undefined

		if (alignment === dock.taskbarAlignment)
			return false

		await this.#actions.setDockTaskbarAlignment(dock.id, alignment)
		return true
	}

	previewAlignment(dock: Dock) {
		const operation = this.#operation.value
		if ((operation?.dockId === dock.id) && operation.grippingAlignment)
			return operation.grippingAlignment

		return dock.taskbarAlignment
	}

	snapAlignment(panel: PanelBox, pointer: PointerPoint): TaskbarAlignment | null {
		if (panel.width === 0 || panel.height === 0)
			return null

		const nx = (pointer.x - panel.left) / panel.width
		const ny = (pointer.y - panel.top) / panel.height

		if (nx < 0 || nx > 1 || ny < 0 || ny > 1)
			return null

		if (ny < nx && ny < 1 - nx)
			return "top"

		if (ny > nx && ny > 1 - nx)
			return "bottom"

		if (nx < ny && nx < 1 - ny)
			return "left"

		if (nx > ny && nx > 1 - ny)
			return "right"

		return null
	}

	updatePreviewFromPointer(panel: PanelBox, pointer: PointerPoint) {
		this.updatePreview(this.snapAlignment(panel, pointer))
	}
}
