
import {dom} from "@e280/sly"
import {Layout} from "../layout.js"
import {PanelSpecs} from "../types.js"
import {LettuceLayout} from "../../lettuce-layout/component.js"

export class Dom {
	views: LettuceViews
	components: LettuceComponents

	constructor(layout: Layout<any>) {
		const {views, components} = prepareDom(layout)
		this.views = views
		this.components = components
	}

	registerComponents() {
		dom.register(this.components)
	}
}

export type LettuceViews = ReturnType<typeof prepareDom>["views"]
export type LettuceComponents = ReturnType<typeof prepareDom>["components"]

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

