
import {register_to_dom} from "@benev/slate"
import {LettuceLayout} from "./elements/lettuce-layout/element.js"
import {LettuceContext, LettuceOptions, lettuceNexus} from "./context/context.js"

export function setupLettuce(options: LettuceOptions) {
	lettuceNexus.context = new LettuceContext(options)
	register_to_dom({LettuceLayout})
}

