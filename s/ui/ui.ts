
import {dom} from "@e280/sly"
import {Layout} from "../logic/layout.js"
import {PanelSpecs} from "../logic/types.js"
import {LettuceLayout} from "./lettuce-layout/component.js"

export type UiViews = ReturnType<typeof prepareDom>["views"]
export type UiComponents = ReturnType<typeof prepareDom>["components"]

export class Ui {
	views: UiViews
	components: UiComponents

	constructor(layout: Layout<any>) {
		const {views, components} = prepareDom(layout)
		this.views = views
		this.components = components
	}

	registerComponents() {
		dom.register(this.components)
	}
}

function prepareDom<PS extends PanelSpecs>(layout: Layout<PS>) {
	const views = {
		LettuceLayout: LettuceLayout({layout}),
	}

	return {
		views,
		components: {
			LettuceLayout: views.LettuceLayout.component().props(() => []),
		},
	}
}

