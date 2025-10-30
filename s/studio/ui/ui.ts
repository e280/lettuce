
import {dom} from "@e280/sly"
import {Desk} from "./desk/view.js"
import {Studio} from "../studio.js"
import {PanelSpecs} from "../types.js"

export type UiViews = ReturnType<typeof prepareDom>["views"]
export type UiComponents = ReturnType<typeof prepareDom>["components"]

export class Ui {
	views: UiViews
	components: UiComponents

	constructor(studio: Studio<any>) {
		const {views, components} = prepareDom(studio)
		this.views = views
		this.components = components
	}

	registerComponents() {
		dom.register(this.components)
	}
}

function prepareDom<PS extends PanelSpecs>(studio: Studio<PS>) {
	const views = {
		Desk: Desk({studio}),
	}

	return {
		views,
		components: {
			LettuceDesk: views.Desk.component().props(() => []),
		},
	}
}

