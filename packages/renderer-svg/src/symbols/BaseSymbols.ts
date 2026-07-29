import type {
    SymbolProvider
} from "@electrodsl/library";


export function drawSymbol(
    type: string,
    x: number,
    y: number,
    provider: SymbolProvider
): string {


    const svg =
        provider.getSymbol(type);


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


    const match =
        svg.match(
            /<svg[^>]*>([\s\S]*)<\/svg>/
        );


    return `
<g transform="translate(${x},${y})">

${match ? match[1] : svg}

</g>
`;

}