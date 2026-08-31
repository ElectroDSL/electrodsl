import type { ElectricalGraph } from "@electrodsl/graph";
import {
    GraphTraversal
} from "@electrodsl/graph";

import type { LayoutNode } from "../model/LayoutNode.js";


export class LayerAssignment {


    constructor(
        private readonly graph: ElectricalGraph
    ) {}



    assign(
        startNodeId: string
    ): LayoutNode[] {


        const traversal =
            new GraphTraversal(this.graph);



        const nodes =
            traversal.bfs(startNodeId);



        const result: LayoutNode[] = [];



        nodes.forEach(
            (node, index) => {


                result.push({

                    nodeId:
                        node.id,


                    layer:
                        index,


                    x:
                        index * 250,


                    y:
                        0

                });


            }
        );



        return result;

    }

}