
import {PanelProps, PanelSpec} from "./types.js"
import {nexus as slateNexus, Content, Context, LightViewRenderer, Nexus, ShadowViewRenderer} from "@benev/slate"

export class PanelHelper {

	shadowView({nexus = slateNexus, label, icon, render}: {
			nexus?: Nexus<Context>,
			label: string,
			icon: () => Content,
			render: ShadowViewRenderer<Context, [PanelProps]>,
		}): PanelSpec {
		const View = nexus.shadowView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View([props]),
		}
	}

	lightView({nexus = slateNexus, label, icon, render}: {
			nexus?: Nexus<Context>,
			label: string,
			icon: () => Content,
			render: LightViewRenderer<Context, [PanelProps]>,
		}): PanelSpec {
		const View = nexus.lightView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View(props),
		}
	}
}

