export class SvgDefs {


    private symbols =
        new Map<string,string>();


    addSymbol(
        id:string,
        content:string
    ):void {

        if(!this.symbols.has(id)){

            this.symbols.set(
                id,
                content
            );

        }

    }



    render():string {


        if(this.symbols.size===0){

            return "";

        }


        return `

<defs>

${

Array.from(
    this.symbols.entries()
)
.map(
([id,content])=>`

<symbol id="${id}">

${content}

</symbol>

`
)
.join("\n")

}

</defs>

`;

    }

}