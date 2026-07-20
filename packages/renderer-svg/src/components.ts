import {
ComponentNode
} from "@electrodsl/ast";


export function renderComponent(
component:ComponentNode,
x:number,
y:number
){

return `

<rect 
x="${x}"
y="${y}"
width="100"
height="50"
fill="white"
stroke="black"/>


<text
x="${x+10}"
y="${y+30}"
font-size="14">

${component.id}

</text>

`;

}