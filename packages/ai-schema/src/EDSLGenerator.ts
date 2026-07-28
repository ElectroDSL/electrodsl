import { AISchematic } from "./AIComponentSchema";


export function generateEDSL(
    schematic:AISchematic
):string {


let output = "";

output += `design ${schematic.design.name.replace(/\s+/g,"_")} {\n\n`;


for(const component of schematic.components){

output += `component ${component.id} {\n`;
output += `    type: ${component.type}\n`;
output += `}\n\n`;

}


for(const connection of schematic.connections){

output +=
`connect ${connection.from} -> ${connection.to}\n`;

}


output += "\n}";


return output;

}