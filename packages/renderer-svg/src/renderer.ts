import { drawSymbol } from "./symbols/index.js";
import {
    DocumentNode,
    CircuitNode,
    ComponentNode
} from "@electrodsl/ast";

export function renderSVG(
    document: DocumentNode
): string {

    const circuit = document.project.circuits[0];

    if (!circuit) {
        return emptySvg();
    }

    return renderCircuit(circuit);
}


function renderCircuit(
    circuit: CircuitNode
): string {

    let y = 40;

    const components = circuit.components
        .map(component => {

            const svg = renderComponent(component, y);

            y += 80;

            return svg;

        })
        .join("\n");


    return `
<svg
xmlns="http://www.w3.org/2000/svg"
width="800"
height="600">

${components}

</svg>
`;
}


function renderComponent(
    component: ComponentNode,
    y: number
): string {

    const x = 100;

    const symbol = drawSymbol(
        component.componentType,
        x,
        y
    );


    return `
${symbol}

<text
    x="${x}"
    y="${y + 50}"
    font-size="12">
${component.id}
</text>
`;

}


function emptySvg(): string {

    return `
<svg
xmlns="http://www.w3.org/2000/svg"
width="800"
height="600">
</svg>
`;

}