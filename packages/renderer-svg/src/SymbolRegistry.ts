import type { SymbolProvider } from "@electrodsl/library";
import { SvgDocument } from "./SvgDocument.js";


export class SymbolRegistry {


    private registered =
        new Set<string>();



    constructor(
        private readonly svg: SvgDocument,
        private readonly provider: SymbolProvider
    ) {}



    private symbolId(type:string):string {

        return `edsl-${type.toLowerCase()}`;

    }



    register(
        type: string
    ): void {


        if (this.registered.has(type)) {

            return;

        }


        const symbol =
            this.provider.getSymbol(type);



        if (!symbol) {

            return;

        }



        const content =
            this.extractContent(symbol);



        this.svg.addSymbol(
            this.symbolId(type),
            content
        );


        this.registered.add(type);

    }





    use(
        type: string,
        position: {
            x:number;
            y:number;
            rotation?:number;
            scale?:number;
            mirrorX?:boolean;
            mirrorY?:boolean;
        }
    ):string {


        const rotation =
            position.rotation ?? 0;


        const scale =
            position.scale ?? 1;



        const scaleX =
            position.mirrorX
            ? -scale
            : scale;


        const scaleY =
            position.mirrorY
            ? -scale
            : scale;



        return `

<g

transform="
translate(${position.x},${position.y})
rotate(${rotation})
scale(${scaleX},${scaleY})
"

class="edsl-symbol">


<use

href="#${this.symbolId(type)}"

/>


</g>

`;

    }





    private extractContent(
        svg:string
    ):string {


        const match =
            svg.match(
                /<svg[^>]*>([\s\S]*)<\/svg>/
            );


        return match
            ? match[1]
            : svg;

    }


}