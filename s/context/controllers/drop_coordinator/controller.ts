
import {drag_has_files, dropped_files, pubsub, ShockDrop} from "@benev/slate"

export class DropCoordinator {

	/** listen to this to react to file drops onto the editor */
	on_file_drop = pubsub<[File[]]>()

	/** dropzone handling for the editor at large */
	editor = new ShockDrop({
		predicate: drag_has_files,
		handle_drop: event => {
			this.on_file_drop.publish(dropped_files(event))
		},
	})
}

