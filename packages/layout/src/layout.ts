import { CircuitNode } from "@electrodsl/ast";
import { LayoutMap } from "./types.js";

export function autoLayout(
    circuit: CircuitNode
): LayoutMap {

    const positions = new Map();

    circuit.components.forEach((component,index)=>{

        positions.set(component.id,{
            x:80 + index*180,
            y:120
        });

    });

    return positions;

}