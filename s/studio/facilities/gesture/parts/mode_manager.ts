
// import {Pojo, ob, pub} from "@benev/slate"
// import {EditorBinds} from "../editor_binds.js"
// import {Mode} from "../../../../tools/impulse/binds.js"
// import {Modes} from "../../../../tools/impulse/parts/modes.js"

// export class ModeManager {
// 	onChange = pub<EditorModes>()
// 	#change = () => this.onChange.publish(this.modes)

// 	constructor(public modes: EditorModes) {
// 		this.preset.plain()
// 	}

// 	preset = setup_presets(() => this.modes, this.#change, {
// 		plain: modes => modes
// 			.wipe()
// 			.enable("always")
// 			.enable("plain")
// 			.enable("selectable")
// 			,

// 		flycam: modes => modes
// 			.wipe()
// 			.enable("always")
// 			.enable("flycam")
// 			.enable("fps")
// 			.enable("selectable")
// 			,

// 		operation: modes => modes
// 			.wipe()
// 			.enable("always")
// 			.enable("operation")
// 			,
// 	})
// }

// //////
// //////
// //////

// type EditorModes = Modes<Mode<EditorBinds>>
// type Setters = Pojo<(m: EditorModes) => void>

// function setup_presets<Fns extends Setters>(
// 		getModes: () => EditorModes,
// 		change: () => void,
// 		fns: Fns
// 	) {
// 	return ob.map(fns, fn => () => {
// 		fn(getModes())
// 		change()
// 	})
// }

