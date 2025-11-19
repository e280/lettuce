
import {signal} from "@e280/strata"

import {Dock, Id} from "../../../../layout/types.js"
import {Layout} from "../../../../layout/layout.js"
import {Actions} from "../../../../layout/parts/actions.js"
import {Explorer} from "../../../../layout/parts/explorer.js"

export type TabDragOperation = {
	surfaceId: Id
	proposedDestination: null | {
		dockId: Id
		surfaceIndex: number
	}
}

export class TabDragger {
	#operation = signal<TabDragOperation | undefined>(undefined)
	#explorer: Explorer
	#actions: Actions

	constructor(layout: Layout) {
		this.#explorer = layout.explorer
		this.#actions = layout.actions
	}

	isSurfaceDragging(id: Id) {
    return this.#operation.value?.surfaceId === id
	}

	get destination() {
  	return this.#operation.value?.proposedDestination
	}

	isSurfaceIndicated(dockId: Id, idx: number) {
  	return this.destination?.dockId === dockId && this.destination?.surfaceIndex === idx
	}

	isDockIndicated(dockId: Id) {
  	return this.destination?.dockId === dockId
	}

	dockDropIndex(dockId: Id) {
  	return this.destination?.dockId === dockId ? this.destination.surfaceIndex : undefined
	}

	tab = {
  	start: (surfaceId: Id) => (_: DragEvent) => this.#operation.value = {surfaceId, proposedDestination: null}
	}

	dock = {
		enter: (dockId: Id) => (e: DragEvent) => this.#updateDest(dockId, e),
		over: (dockId: Id) => (e: DragEvent) => {
  		e.preventDefault()
  		this.#updateDest(dockId, e)
		},
		leave: () => (e: DragEvent) => {
  		const op = this.#operation.value
  		if (op && !e.relatedTarget)
      	this.#operation.value = {...op, proposedDestination: null}
		},
		end: () => () => this.#operation.value = undefined,
		drop: () => () => {
  		const {surfaceId, proposedDestination: dest} = this.#operation.value || {}
  		if (surfaceId && dest) {
    		this.#actions.moveSurface(surfaceId, dest.dockId, dest.surfaceIndex)
  		}
  		this.#operation.value = undefined
		},
	}

	#updateDest(dockId: Id, e: DragEvent) {
		const op = this.#operation.value
		if (!op) return

		const dock = this.#explorer.docks.require(dockId)
		this.#operation.value = {
  		...op,
  		proposedDestination: {
      	dockId: dock.id,
      	surfaceIndex: this.#calcIndex(e, dock)
  		}
		}
	}

	#calcIndex(e: DragEvent, dock: Dock) {
		const tabs = (e.currentTarget as Element)?.querySelector(".tabs")
		if (!tabs || !dock.children.length)
  		return dock.children.length

		const isVert = ["left", "right"].includes(dock.taskbarAlignment)
		const mouse = isVert ? e.clientY : e.clientX
		const nodes = Array.from(tabs.children).filter(n => n.hasAttribute("data-tab-for-surface"))

		const idx = nodes.findIndex(node => {
  		const {top, left, width, height} = node.getBoundingClientRect()
  		const midpoint = isVert ? top + (height / 2) : left + (width / 2)
  		return mouse < midpoint
		})

		return idx === -1 ? nodes.length : idx
	}
}
