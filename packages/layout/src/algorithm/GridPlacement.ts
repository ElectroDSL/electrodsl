import type { ElectricalNode } from "@electrodsl/graph";
import type { LayoutNode } from "../model/LayoutNode.js";


export class GridPlacement {


    constructor(
        private readonly layerSpacing = 250,
        private readonly nodeSpacing = 120
    ) {}



    place(
    nodes: readonly ElectricalNode[],
    layers: Map<string, number>
): LayoutNode[] {


        const counters =
            new Map<number, number>();


        const result: LayoutNode[] = [];



        for(const node of nodes) {


            const layer =
                layers.get(node.id) ?? 0;



            const index =
                counters.get(layer) ?? 0;



            counters.set(
                layer,
                index + 1
            );



            result.push({

                node,

                layer,

                x: layer * this.layerSpacing,

                y: index * this.nodeSpacing

            });


        }



        return result;

    }

}