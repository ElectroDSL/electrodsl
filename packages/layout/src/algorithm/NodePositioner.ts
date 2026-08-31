import type { ElectricalNode } from "@electrodsl/graph";
import type { PositionedNode } from "../model/PositionedNode.js";


/**
 * Assigns drawing coordinates to electrical nodes.
 */
export function positionNodes(
    nodes: ElectricalNode[]
): PositionedNode[] {


    const result: PositionedNode[] = [];


    const spacingX = 200;
    const spacingY = 120;


    nodes.forEach((node, index)=>{


        result.push({

            id: node.id,

            type: node.type,

            x:
                index * spacingX,

            y:
                0,

            width:
                80,

            height:
                40,

            layer:
                0

        });


    });


    return result;

}