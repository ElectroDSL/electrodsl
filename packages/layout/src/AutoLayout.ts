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
    startNodeId: string
): LayoutResult[] {


    const layers =
        new LayerCalculator(graph)
            .calculate(startNodeId);



    const nodes =
        graph.getNodes();



    const positioned =
        new GridPlacement()
            .place(
                nodes,
                layers
            );



    return positioned.map(item => ({

        node: item.node,

        x: item.x,

        y: item.y,

        layer:
            layers.get(item.node.id) ?? 0

    }));

}