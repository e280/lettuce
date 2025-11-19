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

type DragContext = {
	surfaceId: Id
	pointerId: number
	tabElement: HTMLElement
	sourceDockElement: HTMLElement
	axis: "x" | "y"
	originX: number
	originY: number
	minDelta: number
	maxDelta: number
	lifted: boolean
}

const liftThreshold = 3

export class TabDragger {
	#operation = signal<TabDragOperation | undefined>(undefined)
	#explorer: Explorer
	#actions: Actions

	#drag?: DragContext
	#shiftedDock: HTMLElement | null = null

	#moveHandler = (event: PointerEvent) => this.#onPointerMove(event)
	#upHandler = (event: PointerEvent) => this.#onPointerUp(event)
	#cancelHandler = (event: PointerEvent) => this.#onPointerUp(event)

	constructor(layout: Layout) {
		this.#explorer = layout.explorer
		this.#actions = layout.actions
	}

	isSurfaceDragging(surfaceId: Id) {
		return this.#operation.value?.surfaceId === surfaceId
	}

	dockDropIndex(dockId: Id) {
		const destination = this.#operation.value?.proposedDestination
		return (destination && destination.dockId === dockId)
			? destination.surfaceIndex
			: undefined
	}

	isDockIndicated(dockId: Id) {
		const destination = this.#operation.value?.proposedDestination
		return destination?.dockId === dockId
	}

	tab = {
		start: (surfaceId: Id) => (event: PointerEvent) => {
			if (event.button !== 0 || this.#drag)
				return

			const tabElement = event.currentTarget instanceof HTMLElement
				? event.currentTarget
				: undefined
			const dockElement = this.#findDockElement(event)

			if (!tabElement || !dockElement)
				return

			const tabsElement = dockElement.querySelector<HTMLElement>(".tabs")
			if (!tabsElement)
				return

			const axis = this.#axisForDock(dockElement)
			const {minDelta, maxDelta} = this.#calculateBounds(tabsElement, tabElement, axis)

			this.#drag = {
				surfaceId,
				pointerId: event.pointerId,
				tabElement,
				sourceDockElement: dockElement,
				axis,
				originX: event.clientX,
				originY: event.clientY,
				minDelta,
				maxDelta,
				lifted: false,
			}

			event.preventDefault()
			tabElement.setPointerCapture(event.pointerId)

			window.addEventListener("pointermove", this.#moveHandler)
			window.addEventListener("pointerup", this.#upHandler)
			window.addEventListener("pointercancel", this.#cancelHandler)
		},
	}

	#onPointerMove(event: PointerEvent) {
		const context = this.#drag
		if (!context || event.pointerId !== context.pointerId)
			return

		if (!context.lifted) {
			const deltaX = Math.abs(event.clientX - context.originX)
			const deltaY = Math.abs(event.clientY - context.originY)
			if (deltaX < liftThreshold && deltaY < liftThreshold)
				return
			this.#liftTab(context)
		}

		this.#translateTab(context, event)
		this.#updateDestination(event, context)
	}

	#onPointerUp(event: PointerEvent) {
		window.removeEventListener("pointermove", this.#moveHandler)
		window.removeEventListener("pointerup", this.#upHandler)
		window.removeEventListener("pointercancel", this.#cancelHandler)
		void this.#dropTab(event)
	}

	#liftTab(context: DragContext) {
		context.lifted = true
		Object.assign(context.tabElement.style, {
			zIndex: "1000",
			pointerEvents: "none",
			position: "relative",
			transition: "none"
		})

		this.#operation.value = {
			surfaceId: context.surfaceId,
			proposedDestination: null,
		}
	}

	#translateTab(context: DragContext, event: PointerEvent) {
		const deltaX = event.clientX - context.originX
		const deltaY = event.clientY - context.originY

		if (context.axis === "x") {
			const clamped = this.#clamp(deltaX, context.minDelta, context.maxDelta)
			context.tabElement.style.transform = `translate(${clamped}px, 0)`
		}
		else {
			const clamped = this.#clamp(deltaY, context.minDelta, context.maxDelta)
			context.tabElement.style.transform = `translate(0, ${clamped}px)`
		}
	}

	#updateDestination(event: PointerEvent, context: DragContext) {
		const hoveredDockElement =
			this.#findDockElement(event) ?? context.sourceDockElement

		const dockId = hoveredDockElement.getAttribute("data-dock-id")
		if (!dockId) {
			this.#setDestination(null)
			this.#clearVisualShifts()
			return
		}

		const dock = this.#explorer.docks.require(dockId)
		const surfaceIndex = this.#calculateInsertIndex(event, dock, hoveredDockElement)

		this.#setDestination({
			dockId: dock.id,
			surfaceIndex,
		})

		this.#applyVisualShifts(hoveredDockElement, surfaceIndex, context.surfaceId)
	}

	#setDestination(destination: TabDragOperation["proposedDestination"]) {
		const operation = this.#operation.value
		if (!operation)
			return
		this.#operation.value = {
			surfaceId: operation.surfaceId,
			proposedDestination: destination,
		}
	}

    async #dropTab(event: PointerEvent) {
      const context = this.#drag
      if (!context) return

      try {
        context.tabElement.releasePointerCapture(context.pointerId)

        if (context.lifted) {
          const destination = this.#operation.value?.proposedDestination
          if (destination) {
            await this.#actions.moveSurface(
              context.surfaceId,
              destination.dockId,
              destination.surfaceIndex,
            )
          }
        }
      } finally {
        this.#resetTabStyles(context.tabElement)
        this.#cleanup()
    }
  }

	#cleanup() {
		this.#clearVisualShifts()
		this.#operation.value = undefined
		this.#drag = undefined
	}

	#resetTabStyles(tabElement: HTMLElement) {
		Object.assign(tabElement.style, {
			zIndex: "",
			pointerEvents: "",
			position: "",
			transition: "",
			transform: "",
		})
	}

	#calculateBounds(tabsElement: HTMLElement, tabElement: HTMLElement, axis: "x" | "y") {
		const container = tabsElement.getBoundingClientRect()
		const tabBox = tabElement.getBoundingClientRect()

		return (axis === "x")
			? {
				minDelta: container.left - tabBox.left,
				maxDelta: container.right - tabBox.right,
			}
			: {
				minDelta: container.top - tabBox.top,
				maxDelta: container.bottom - tabBox.bottom,
			}
	}

	#calculateInsertIndex(event: PointerEvent, dock: Dock, dockElement: HTMLElement) {
		const tabs = this.#tabElements(dockElement)
		if (tabs.length === 0)
			return 0

		const isVertical = dock.taskbarAlignment === "left" || dock.taskbarAlignment === "right"
		const pointerPosition = isVertical ? event.clientY : event.clientX

		for (const [index, tab] of tabs.entries()) {
			const rect = tab.getBoundingClientRect()
			const midpoint = isVertical
				? rect.top + (rect.height / 2)
				: rect.left + (rect.width / 2)

			if (pointerPosition < midpoint)
				return index
		}

		return tabs.length
	}

	#applyVisualShifts(dockElement: HTMLElement, insertIndex: number, surfaceId: Id) {
		if (this.#shiftedDock && this.#shiftedDock !== dockElement)
			this.#clearVisualShifts()

		const tabs = this.#tabElements(dockElement)
		if (tabs.length === 0)
			return

		const originIndex = tabs.findIndex(tab =>
			tab.getAttribute("data-tab-for-surface") === surfaceId
		)

		for (const tab of tabs)
			tab.removeAttribute("data-shift")

		if (originIndex === -1) {
			for (const [index, tab] of tabs.entries())
				if (index >= insertIndex)
					tab.setAttribute("data-shift", "positive")
		}
		else if (insertIndex > originIndex) {
			for (const [index, tab] of tabs.entries())
				if (index > originIndex && index < insertIndex)
					tab.setAttribute("data-shift", "negative")
		}
		else if (insertIndex < originIndex) {
			for (const [index, tab] of tabs.entries())
				if (index >= insertIndex && index < originIndex)
					tab.setAttribute("data-shift", "positive")
		}

		this.#shiftedDock = dockElement
	}

	#clearVisualShifts() {
		if (!this.#shiftedDock)
			return

		for (const tab of this.#tabElements(this.#shiftedDock))
			tab.removeAttribute("data-shift")

		this.#shiftedDock = null
	}

	#tabElements(dockElement: HTMLElement) {
		return Array.from(
			dockElement.querySelectorAll<HTMLElement>("[data-tab-for-surface]"),
		)
	}

	#findDockElement(event: PointerEvent) {
		for (const item of event.composedPath())
			if (item instanceof HTMLElement && item.hasAttribute("data-dock-id"))
				return item
		return undefined
	}

	#axisForDock(dockElement: HTMLElement): "x" | "y" {
		const alignment = dockElement.getAttribute("data-taskbar-alignment")
		return (alignment === "left" || alignment === "right") ? "y" : "x"
	}

	#clamp(value: number, min: number, max: number) {
		return Math.max(min, Math.min(max, value))
	}
}

