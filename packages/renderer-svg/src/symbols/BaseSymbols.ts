import { symbolProvider } from "./SymbolProvider.js";

export function drawSymbol(
    type: string,
    x: number,
    y: number
): string {

    const svg = symbolProvider.getSymbol(type);

    if (!svg) {

        return `
<rect
x="${x}"
y="${y}"
width="80"
height="60"
fill="none"
stroke="red"/>
`;
    }

    return `
<g transform="translate(${x},${y})">

${extractSvgContent(svg)}

</g>`;
}


function extractSvgContent(svg: string): string {

    const match = svg.match(
        /<svg[^>]*>([\s\S]*)<\/svg>/
    );

    return match ? match[1] : svg;
}