import type { ElectricalNode } from "@electrodsl/graph";

import type { LayoutNode } from "../model/LayoutNode.js";


export class GridPlacement {


    place(
        nodes: readonly ElectricalNode[],
        layers: Map<string, number>
    ): LayoutNode[] {


        const result: LayoutNode[] = [];

        const layerCounts =
            new Map<number, number>();


        const spacingX = 250;
        const spacingY = 120;


        nodes.forEach(
            node => {


                const layer =
                    layers.get(node.id) ?? 0;

                const index =
                    layerCounts.get(layer) ?? 0;

                layerCounts.set(
                    layer,
                    index + 1
                );


                result.push({

                    nodeId:
                        node.id,


                    x:
                        layer * spacingX,


                    y:
                        index * spacingY,


                    layer

                });


            }
        );


        return result;

    }

}
