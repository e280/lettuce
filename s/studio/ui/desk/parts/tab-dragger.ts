import {signal, SignalFn} from "@e280/strata"

import {deepHitTest} from "./drag-utils.js"
import {Dock, Id} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"
import {Actions} from "../../../../layout/parts/actions.js"
import {Explorer} from "../../../../layout/parts/explorer.js"

export interface TabDragState {
	axis: 'x' | 'y'
	origin: {x: number, y: number}
	bounds: {min: number, max: number}
	clamped: boolean,
	position: {
		x: number
		y: number
	}
	lifted: boolean
	tabSize: number
}

export type TabDragOperation = {
	surfaceId: Id
	sourceDockId: Id
	sourceIndex: number
	proposedDestination: null | {
		dockId: Id
		surfaceIndex: number
	}
	dragState: null | TabDragState
}

type PointerPoint = {x: number; y: number}

export class TabDragger {
	#operation: SignalFn<TabDragOperation | undefined>
	#explorer: Explorer
	#actions: Actions

	constructor(layout: Layout) {
		this.#explorer = layout.explorer
		this.#actions = layout.actions
		this.#operation = signal<TabDragOperation | undefined>(undefined)
	}

	get dragState(): TabDragState | null | undefined {
		return this.#operation.value?.dragState
	}

	set dragState(v: TabDragState | null) {
		if(this.#operation.value)
			this.#operation.value.dragState = v
	}

	isSurfaceDragging(surfaceId: Id) {
		return this.#operation.value?.surfaceId === surfaceId
	}

	dockDropIndex(dockId: Id) {
		const destination = this.#operation.value?.proposedDestination
		return destination?.dockId === dockId
			? destination.surfaceIndex
			: undefined
	}

	isDockIndicated(dockId: Id) {
		return this.#operation.value?.proposedDestination?.dockId === dockId
	}

	sourceIndexForDock(dockId: Id) {
		const operation = this.#operation.value
		return operation?.sourceDockId === dockId
			? operation.sourceIndex
			: undefined
	}

	start(surfaceId: Id, dragState: TabDragState) {
		const report = this.#explorer.surfaces.requireReport(surfaceId)
		const parentDock = this.#explorer.surfaces.parent(surfaceId)

		this.#operation.value = {
			surfaceId,
			sourceDockId: parentDock.id,
			sourceIndex: report.index,
			proposedDestination: null,
			dragState
		}
	}

	isHoveringTabs(e: PointerEvent, dockEl: HTMLElement, ignored: HTMLElement) {
		const tabs = dockEl.querySelector('.tabs') as HTMLElement | null
		if (!tabs) return false

		const res = deepHitTest({
			x: e.clientX,
			y: e.clientY,
			ignored,
			predicate: node =>
				node === tabs || tabs.contains(node),
		})

		return Boolean(res)
	}

	preview(dockElement: HTMLElement, pointer: PointerPoint, e: PointerEvent) {
		const operation = this.#operation.value
		if (!operation)
			return

		const dockId = dockElement.getAttribute("data-dock-id")

		const hoveringTabs = this.isHoveringTabs(e, dockElement, e.currentTarget as HTMLElement)

		if (!dockId || !hoveringTabs) {
			this.#operation.value = {
				...operation,
				proposedDestination: null,
			}
			return
		}

		const dock = this.#explorer.docks.require(dockId)
		const surfaceIndex = this.#calculateInsertIndex(dockElement, pointer, dock)

		this.#operation.value = {
			...operation,
			proposedDestination: {
				dockId: dock.id,
				surfaceIndex,
			},
		}
	}

	clearPreview() {
		const operation = this.#operation.value
		if (!operation)
			return

		this.#operation.value = {
			...operation,
			proposedDestination: null,
		}
	}

	async drop() {
		const operation = this.#operation.value
		this.#operation.value = undefined

		if (operation?.proposedDestination) {
			const {dockId, surfaceIndex} = operation.proposedDestination
			await this.#actions.moveSurface(
				operation.surfaceId,
				dockId,
				surfaceIndex
			)
		}
	}

	get sourceDockId() {
		return this.#operation.value?.sourceDockId
	}

	calculateShift(dockId: Id, surfaceIndex: number, surfaceId: Id) {
		const dropIndex = this.dockDropIndex(dockId)
		const sourceIndex = this.sourceIndexForDock(dockId)
		const isDragged = this.isSurfaceDragging(surfaceId)

		if (isDragged || dropIndex == null)
			return

		if (sourceIndex == null) {
			return surfaceIndex >= dropIndex ? 'positive' : undefined
		}

		if (dropIndex > sourceIndex) {
			return (surfaceIndex > sourceIndex && surfaceIndex < dropIndex)
	   		? 'negative'
	   		: undefined
		}

		if (dropIndex < sourceIndex)
			return (surfaceIndex >= dropIndex && surfaceIndex < sourceIndex)
	   		? 'positive'
	   		: undefined


		return
	}

	#calculateInsertIndex(dockElement: HTMLElement, pointer: PointerPoint, dock: Dock) {
		const tabs = this.#tabElements(dockElement)
		if (tabs.length === 0)
			return dock.children.length

		const vertical = dock.taskbarAlignment === "left" || dock.taskbarAlignment === "right"
		const cursor = vertical ? pointer.y : pointer.x

		for (const [index, tab] of tabs.entries()) {
			const rect = tab.getBoundingClientRect()
			const midpoint = vertical
				? rect.top + (rect.height / 2)
				: rect.left + (rect.width / 2)

			if (cursor < midpoint)
				return index
		}

		return tabs.length
	}

	#tabElements(dockElement: HTMLElement) {
		return Array.from(
			dockElement.querySelectorAll<HTMLElement>("[data-tab-for-surface]"),
		)
	}
}
