
import {Lettuce} from "../context/lettuce.js"
import {AboutPanel} from "./panels/about/panel.js"
import {UnknownPanel} from "./panels/unknown/panel.js"
import {LoremIpsumPanel} from "./panels/lorem-ipsum/panel.js"

Lettuce
	.panels({AboutPanel, LoremIpsumPanel, UnknownPanel})
	.layout(layout => ({
		default: layout.single("AboutPanel"),
		empty: layout.single("AboutPanel"),
	}))
	.setup()

