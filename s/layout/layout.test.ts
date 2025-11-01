
import {suite, test, expect} from "@e280/science"
import {Layout} from "./layout.js"
import {basicStock} from "./testing/setup-basic-layout.js"

export default suite({
	"layout has cells/docks/surfaces": test(async() => {
		const layout = new Layout({stock: basicStock()})
		expect(layout.explorer.cells.count).is(1)
		expect(layout.explorer.docks.count).is(1)
		expect(layout.explorer.surfaces.count).is(3)
	}),
})

