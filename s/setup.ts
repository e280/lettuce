
import {register_to_dom} from "@benev/slate"
import {LatticeLayout} from "./elements/lattice-layout/element.js"
import {LatticeContext, LatticeOptions, latticeNexus} from "./context/context.js"

export function setupLattice(options: LatticeOptions) {
	latticeNexus.context = new LatticeContext(options)
	register_to_dom({LatticeLayout})
}

