
import {effect} from "@e280/strata"
import {suite, test, expect} from "@e280/science"
import {Layout} from "./layout.js"
import {Blueprint, Cell, TaskbarAlignment} from "./types.js"
import {BasicPanelName, basicStock} from "./testing/setup.js"
import {redistribute_child_sizes_fairly, redistribute_child_sizes_locally} from "./parts/action-utils.js"

export default suite({
	"has cells/docks/surfaces": test(async() => {
		const layout = new Layout({stock: basicStock()})
		expect(layout.explorer.cells.count).is(1)
		expect(layout.explorer.docks.count).is(1)
		expect(layout.explorer.surfaces.count).is(3)
	}),

	".on subscribes to changes": test(async() => {
		const layout = new Layout({stock: basicStock()})
		let blueprint: Blueprint | undefined
		const stop = layout.on(b => { blueprint = b })
		expect(blueprint).not.happy()
		await layout.actions.reset(layout.stock.empty())
		expect(blueprint).happy()
		stop()
	}),

	"strata effects work": test(async() => {
		const layout = new Layout({stock: basicStock()})
		let count = 0
		const stop = effect(() => {
			void layout.explorer.root
			count++
		})
		expect(count).is(1)
		await layout.actions.reset(layout.stock.empty())
		expect(count).is(2)
		stop()
	}),

	"add a panel": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(layout.explorer.surfaces.count).is(3)
		const {surface} = await layout.actions.addSurface(dock.id, "alpha" satisfies BasicPanelName)
		expect(layout.explorer.surfaces.count).is(4)
		expect(layout.explorer.surfaces.require(surface.id).panel).is("alpha")
	}),

	"dock taskbar alignment defaults to top": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(dock.taskbarAlignment).is("top")
	}),

	"dock taskbar alignment covers every edge": test(async() => {
		const alignments: TaskbarAlignment[] = ["top", "right", "bottom", "left"]
		for (const alignment of alignments) {
			const layout = new Layout({stock: basicStock()})
			const [dock] = layout.explorer.docks.nodes
			await layout.actions.setDockTaskbarAlignment(dock.id, alignment)
			expect(layout.explorer.docks.require(dock.id).taskbarAlignment).is(alignment)
			await layout.actions.splitDock(dock.id, false)
			expect(layout.explorer.docks.nodes.every(node => node.taskbarAlignment === alignment)).is(true)
		}
	}),

	"split the dock": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(layout.explorer.docks.count).is(1)
		await layout.actions.splitDock(dock.id, false)
		expect(layout.explorer.docks.count).is(2)
	}),

	"split the dock, sizings, horizontal": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(dock.size).is(1)
		await layout.actions.splitDock(dock.id, false)
		const [dockA, dockB] = layout.explorer.docks.nodes
		expect(dockA.id).is(dock.id)
		expect(dockB.id).not.is(dock.id)
		expect(dockA.size).is(0.5)
		expect(dockB.size).is(0.5)
	}),

	"split the dock, sizings, vertical": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(dock.size).is(1)
		await layout.actions.splitDock(dock.id, true)
		const [dockA, dockB] = layout.explorer.docks.nodes
		expect(dockA.id).is(dock.id)
		expect(dockB.id).not.is(dock.id)
		expect(dockA.size).is(0.5)
		expect(dockB.size).is(0.5)
	}),

	...(() => {
		let id = 0
		const makeCell = (size: number): Cell => ({
			id: (id++).toString(),
			kind: "cell",
			vertical: false,
			children: [],
			size,
		})
		return {
			"redistribution": suite({
				"fair": test(async() => {
					const children = redistribute_child_sizes_fairly([
						makeCell(0),
						makeCell(0),
						makeCell(0),
					])
					expect(children.at(0)!.size).gt(0.3)
					expect(children.at(1)!.size).gt(0.3)
					expect(children.at(2)!.size).gt(0.3)
				}),

				"naive": test(async() => {
					const children = redistribute_child_sizes_locally([
						makeCell(0),
						makeCell(0),
						makeCell(0),
					])
					expect(children.at(0)!.size).is(0)
					expect(children.at(1)!.size).is(0)
					expect(children.at(2)!.size).is(1)
				}),

				"naive excess": test(async() => {
					const children = redistribute_child_sizes_locally([
						makeCell(1),
						makeCell(1),
						makeCell(1),
					])
					expect(children.at(0)!.size).is(1)
					expect(children.at(1)!.size).is(0)
					expect(children.at(2)!.size).is(0)
				}),
			}),
		}
	})(),
})
