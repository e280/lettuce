
import {dom} from "@e280/sly"
import {Studio} from "../studio.js"
import {PanelSpecs} from "../types.js"
import {LettuceLayout} from "./lettuce-layout/component.js"

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
		LettuceLayout: LettuceLayout({studio}),
	}

	return {
		views,
		components: {
			LettuceLayout: views.LettuceLayout.component().props(() => []),
		},
	}
}

