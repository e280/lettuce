
import {effect} from "@e280/strata"
import {suite, test, expect} from "@e280/science"
import {Layout} from "./layout.js"
import {Blueprint} from "./types.js"
import {BasicPanelName, basicStock} from "./testing/setup.js"

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

	"split the dock": test(async() => {
		const layout = new Layout({stock: basicStock()})
		const [dock] = layout.explorer.docks.nodes
		expect(layout.explorer.docks.count).is(1)
		await layout.actions.splitDock(dock.id, false)
		expect(layout.explorer.docks.count).is(2)
	}),
})

