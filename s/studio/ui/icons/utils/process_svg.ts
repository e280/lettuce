
import {xmlns, id} from "./svg_constants.js"
import {render, SVGTemplateResult} from "lit"

export function process_svg_into_instantiable_blob_url(template: SVGTemplateResult) {
	const container = document.createElement("div")
	render(template, container)

	const svg = container.querySelector("svg") as SVGSVGElement
	const g = document.createElementNS(xmlns, "g") as SVGGElement

	const yoink = (n: string) => {
		const result = svg.getAttribute(n)
		svg.removeAttribute(n)
		return result
	}

	yoink("xmlns")
	const width = yoink("width")
	const height = yoink("height")
	const viewBox = yoink("viewBox")
	const className = yoink("class")

	for (const {name, value} of Array.from(svg.attributes)) {
		g.setAttribute(name, value)
		svg.removeAttribute(name)
	}

	while (svg.firstChild)
		g.appendChild(svg.firstChild)

	g.setAttribute("id", id)

	svg.appendChild(g)
	svg.setAttribute("xmlns", xmlns)
	svg.setAttribute("viewBox", viewBox!)

	const blob = new Blob([svg.outerHTML], {type: "image/svg+xml;charset=utf-8"})
	const url = URL.createObjectURL(blob)

	return {
		url,
		width,
		height,
		viewBox,
		className,
	}
}

