import type { PositionedNode } from "@electrodsl/layout";


export function renderComponent(
    node: PositionedNode
): string {


    return `
<g id="${node.id}">

    <rect
        x="${node.x}"
        y="${node.y}"
        width="${node.width}"
        height="${node.height}"
        fill="none"
        stroke="black"
    />

    <text
        x="${node.x + 10}"
        y="${node.y + 25}">
        ${node.type}
    </text>

</g>
`;

}