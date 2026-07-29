import type { SymbolProvider } from "@electrodsl/library";
import { SvgDocument } from "./SvgDocument.js";


export class SymbolRegistry {


    private registered =
        new Set<string>();



    constructor(
        private readonly svg: SvgDocument,
        private readonly provider: SymbolProvider
    ) {}



    register(
        type:string
    ):void {


        if(this.registered.has(type)) {

            return;

        }


        const symbol =
            this.provider.getSymbol(type);



        if(!symbol){

            return;

        }



        const content =
            this.extractContent(symbol);



        this.svg.addSymbol(
            type,
            content
        );


        this.registered.add(type);

    }




    use(
    type:string,
    x:number,
    y:number,
    rotation:number = 0
):string {


return `

<g

transform="
translate(${x},${y})
rotate(${rotation})
"

class="edsl-symbol">


<use

href="#${type}"

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