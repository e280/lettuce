
import {css, html} from "lit"
import {cssReset, view} from "@e280/sly"

export const BroteinPanel = view(use => () => {
	use.css(cssReset, style)

	return html`
		<section>
			<h1>Lorem Ipsum Brotein</h1>
			<p>
				lorem ipsum brotein maximus swoleus pumpa kettlebellus est. creatina deltoidus whey isolata magna shredderino, tempus bulkum dolor sit quadius. macros non negotiatum, veinpop est aestheticum. latissimus sanctum, triceps dominus, cardio? nullum.
			</p>
			<p>
				massae gainium ultra superset pressum pecsium bro. benchum flatum et inclineum done rightum, brotein shakeris clangus echo in gymnatio. in domus flexorum, ego sum preworkout incarnatus, sniffium saltus ammonius, screaming “one more repus.”
			</p>
			<p>
				deadliftum dies glorius, kettlebellus clang clang, gluteus prime rising from chalk dust. brotato chipus, creatinum drip drip, sweatium baptismus. ego venio, ego lifto, ergo sum jackedus maximus.
			</p>
		</section>
	`
})

const style = css`
	section {
		font-size: 1.5em;

		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em 2em;
		max-width: 32em;
		margin: auto;

		h1 {
			text-transform: uppercase;
			opacity: 0.2;
		}
	}
`

