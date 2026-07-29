import type {
    Diagram,
    DiagramNode,
    DiagramWire
} from "@electrodsl/diagram";

import type {
    SymbolProvider
} from "@electrodsl/library";

import { drawSymbol } from "./symbols/BaseSymbols.js";

export function renderDiagram(
    diagram: Diagram,
    symbolProvider: SymbolProvider
): string {

    const wires = diagram.wires
        .map(renderWire)
        .join("\n");

    const nodes = diagram.nodes
        .map(node => renderNode(node, symbolProvider))
        .join("\n");

    return `
<svg
xmlns="http://www.w3.org/2000/svg"
width="${diagram.viewport.width}"
height="${diagram.viewport.height}"
viewBox="0 0 ${diagram.viewport.width} ${diagram.viewport.height}">

<style>

.edsl-wire{
fill:none;
stroke:#111;
stroke-width:2;
stroke-linecap:round;
stroke-linejoin:round;
}

.edsl-component-label{
font:14px sans-serif;
text-anchor:middle;
fill:#111;
}

</style>

${wires}

${nodes}

</svg>
`;

}

function renderNode(
    node: DiagramNode,
    symbolProvider: SymbolProvider
): string {

    return `

<g>

${drawSymbol(
    node.symbol,
    node.x,
    node.y,
    symbolProvider
)}

<text
x="${node.x}"
y="${node.y + 60}"
class="edsl-component-label">

${node.id}

</text>

</g>

`;

}

function renderWire(
    wire: DiagramWire
): string {

    if (!wire.points || wire.points.length < 2) {

        return "";

    }

    const d = wire.points
        .map((point, index) =>
            index === 0
                ? `M ${point.x} ${point.y}`
                : `L ${point.x} ${point.y}`
        )
        .join(" ");

    return `

<path
d="${d}"
class="edsl-wire"/>

`;

}