
import {Content, LightViewRenderer, ShadowViewRenderer} from "@benev/slate"

import {LettuceContext} from "../context.js"
import {PanelProps, PanelSpec} from "./types.js"

export class PanelHelper {

	shadowView({label, icon, render}: {
			label: string,
			icon: () => Content,
			render: ShadowViewRenderer<LettuceContext, [PanelProps]>,
		}): PanelSpec {
		const View = LettuceContext.nexus.shadowView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View([props]),
		}
	}

	lightView({label, icon, render}: {
			label: string,
			icon: () => Content,
			render: LightViewRenderer<LettuceContext, [PanelProps]>,
		}): PanelSpec {
		const View = LettuceContext.nexus.lightView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View(props),
		}
	}
}

