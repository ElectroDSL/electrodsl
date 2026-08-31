import type { ElectricalGraph } from "@electrodsl/graph";

import {
    LayerCalculator,
    GridPlacement
} from "./algorithm/index.js";

import type {
    LayoutResult
} from "./model/LayoutResult.js";



export function autoLayout(
    graph: ElectricalGraph,
    startNodeId?: string
): LayoutResult[] {

    const nodes =
        graph.getNodes();

    if (nodes.length === 0) {

        return [];

    }

    const rootNodeId =
        startNodeId && graph.hasNode(startNodeId)
            ? startNodeId
            : nodes[0].id;

    const layers =
        new LayerCalculator(graph)
            .calculate(rootNodeId);



    const positioned =
        new GridPlacement()
            .place(
                nodes,
                layers
            );



    return positioned.map(item => {


        const node =
            graph.getNode(item.nodeId);



        if (!node) {

            throw new Error(
                `Node not found: ${item.nodeId}`
            );

        }



        return {

            node,

            x: item.x,

            y: item.y,

            layer:
                layers.get(node.id) ?? 0

        };

    });


}
