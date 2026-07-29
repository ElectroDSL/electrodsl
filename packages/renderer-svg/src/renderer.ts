import { drawSymbol } from "./symbols/BaseSymbols.js";
import type { SymbolProvider } from "@electrodsl/library";
import { SvgDocument } from "./SvgDocument.js";

import {
    ComponentNode,
    ConnectionNode,
    CircuitNode,
    DocumentNode
} from "@electrodsl/ast";


interface ComponentPosition {

    x:number;

    y:number;

}


const GRID_SIZE = 40;

const COMPONENT_SPACING_X = GRID_SIZE * 5;

const COMPONENT_SPACING_Y = GRID_SIZE * 3;

const COMPONENTS_PER_ROW = 4;

const PAGE_PADDING = GRID_SIZE * 2;

const SYMBOL_TERMINAL_OFFSET = GRID_SIZE;



export function renderSVG(
    document: DocumentNode,
    symbolProvider: SymbolProvider
): string {


    const circuit = document.project.circuits[0];


    if(!circuit){

        return emptySvg();

    }


    return renderCircuit(
        circuit,
        symbolProvider
    );

}



function renderCircuit(
    circuit:CircuitNode,
    symbolProvider:SymbolProvider
):string{


    const positions =
        createComponentPositions(
            circuit.components
        );


    const rows =
        Math.max(
            1,
            Math.ceil(
                circuit.components.length /
                COMPONENTS_PER_ROW
            )
        );


    const width =
        PAGE_PADDING * 2 +
        (COMPONENTS_PER_ROW - 1)
        * COMPONENT_SPACING_X +
        GRID_SIZE * 2;


    const height =
        PAGE_PADDING * 2 +
        (rows - 1)
        * COMPONENT_SPACING_Y +
        GRID_SIZE * 2;



    const svg =
        new SvgDocument(
            width,
            height
        );



    circuit.connections
        .map(connection =>
            renderWire(
                connection,
                positions
            )
        )
        .forEach(wire =>
            svg.add(
                "wires",
                wire
            )
        );



    circuit.components
        .map(component =>
            renderComponent(
                component,
                positions.get(component.id)!,
                symbolProvider
            )
        )
        .forEach(component =>
            svg.add(
                "symbols",
                component
            )
        );



    return svg.render();

}




function createComponentPositions(
    components:ComponentNode[]
):Map<string,ComponentPosition>{


    return new Map(

        components.map(
            (component,index)=>[

                component.id,

                {

                    x:
                    PAGE_PADDING +
                    (index % COMPONENTS_PER_ROW)
                    *
                    COMPONENT_SPACING_X,


                    y:
                    PAGE_PADDING +
                    Math.floor(
                        index /
                        COMPONENTS_PER_ROW
                    )
                    *
                    COMPONENT_SPACING_Y

                }

            ]

        )

    );


}





function renderComponent(
    component:ComponentNode,
    position:ComponentPosition,
    symbolProvider:SymbolProvider
):string{


return `

<g
class="edsl-component"
data-component-id="${escapeAttribute(component.id)}">


${drawSymbol(
    component.componentType,
    position.x,
    position.y,
    symbolProvider
)}


${renderPins(
    component,
    position
)}


<text
x="${position.x}"
y="${position.y + GRID_SIZE + 20}"
text-anchor="middle"
class="edsl-component-label">

${escapeText(component.id)}

</text>


</g>

`;

}




function renderPins(
component:ComponentNode,
position:ComponentPosition
):string{


return component.pins.map(pin=>{


let x=position.x;

let y=position.y;


switch(pin.side){


case "left":

x-=8;

y+=GRID_SIZE/2;

break;



case "right":

x+=GRID_SIZE+8;

y+=GRID_SIZE/2;

break;



case "top":

x+=GRID_SIZE/2;

y-=8;

break;



case "bottom":

x+=GRID_SIZE/2;

y+=GRID_SIZE+8;

break;


}



return `

<circle

cx="${x}"

cy="${y}"

r="3"

class="edsl-pin"

/>


<text

x="${x+6}"

y="${y-4}"

class="edsl-pin-label">

${escapeText(pin.name)}

</text>


`;



}).join("");

}






function renderWire(
connection:ConnectionNode,
positions:Map<string,ComponentPosition>
):string{


const from =
positions.get(
connection.from.component
);


const to =
positions.get(
connection.to.component
);



if(!from || !to){

return "";

}



const startX =
from.x +
SYMBOL_TERMINAL_OFFSET;


const startY =
from.y;



const endX =
to.x -
SYMBOL_TERMINAL_OFFSET;


const endY =
to.y;



const middleX =
Math.round(
(startX+endX) /
(GRID_SIZE*2)
)
*
GRID_SIZE;



const path =
startY===endY

?
`M ${startX} ${startY} H ${endX}`

:

`M ${startX} ${startY} H ${middleX} V ${endY} H ${endX}`;



return `

<path

d="${path}"

class="edsl-wire"

/>


`;

}




function emptySvg():string{


return `

<svg
xmlns="http://www.w3.org/2000/svg"
width="160"
height="160"
viewBox="0 0 160 160">

</svg>

`;

}



function escapeText(value:string):string{


return value
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;");


}



function escapeAttribute(value:string):string{


return escapeText(value)
.replaceAll('"',"&quot;")
.replaceAll("'","&apos;");


}