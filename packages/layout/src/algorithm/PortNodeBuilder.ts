import type { ElectricalNode } from "@electrodsl/graph";
import type { ComponentProvider } from "@electrodsl/library";

import type { PortNode } from "../model/PortNode.js";
import { PortDirection } from "../model/PortDirection.js";


/**
 * Builds PortNodes from electrical components.
 *
 * Port information is obtained from the component library.
 */
export function buildPortNodes(
    nodes: ElectricalNode[],
    components: ComponentProvider
): PortNode[] {


    const result: PortNode[] = [];


    for (const node of nodes) {

        
        const component =
            components.getComponent(node.type);


        if (!component) {

            continue;

        }


        for (const terminal of component.terminals) {


            result.push({

                nodeId:
                    `${node.id}-${terminal.id}`,


                componentId:
                    node.id,


                portId:
                    terminal.id,


                direction:
                    mapDirection(
                        terminal.direction
                    ),


                x:
                    terminal.position.x,


                y:
                    terminal.position.y,


                layer: 0

            });


        }

    }


    return result;

}



/**
 * Converts library pin direction
 * into layout port direction.
 */
function mapDirection(
    direction:
        | "input"
        | "output"
        | "bidirectional"
): PortDirection {


    switch (direction) {


        case "input":
            return PortDirection.Left;


        case "output":
            return PortDirection.Right;


        case "bidirectional":
            return PortDirection.Right;


    }

}