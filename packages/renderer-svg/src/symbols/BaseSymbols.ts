import type {
    SymbolProvider
} from "@electrodsl/library";


export function drawSymbol(
    type: string,
    x: number,
    y: number,
    provider: SymbolProvider
): string {

    const symbol =
        provider.getSymbol(type);

    if (!symbol) {

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

    const match =
        symbol.svg.match(
            /<svg[^>]*>([\s\S]*)<\/svg>/
        );

    const content =
        match
            ? match[1]
            : symbol.svg;

    return `
<g transform="translate(${x},${y})">

${content}

</g>
`;

}