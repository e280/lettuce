
import {PanelProps, PanelSpec} from "./types.js"
import {nexus as slateNexus, Content, Context, LightViewRenderer, Nexus, ShadowViewRenderer} from "@benev/slate"

/** helps you build panels */
export class Pan {
	constructor(public nexus: Nexus<Context> = slateNexus) {}

	plain(panel: PanelSpec) {
		return panel
	}

	shadowView({label, icon, render}: {
			label: string,
			icon: () => Content,
			render: ShadowViewRenderer<Context, [PanelProps]>,
		}): PanelSpec {
		const View = this.nexus.shadowView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View([props]),
		}
	}

	lightView({label, icon, render}: {
			label: string,
			icon: () => Content,
			render: LightViewRenderer<Context, [PanelProps]>,
		}): PanelSpec {
		const View = this.nexus.lightView(render)
		return {
			label,
			icon,
			render: (props: PanelProps) => View(props),
		}
	}
}

export const pan = new Pan()

