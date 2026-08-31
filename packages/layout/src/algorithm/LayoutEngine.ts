import type { ElectricalNode } from "@electrodsl/graph";
import type { ComponentProvider } from "@electrodsl/library";

import type { PlacedLayout } from "../model/PlacedLayout.js";

import { buildLayoutGraph } from "./LayoutGraphBuilder.js";
import { positionNodes } from "./NodePositioner.js";


/**
 * Complete automatic layout pipeline.
 */
export function createLayout(
    nodes: ElectricalNode[],
    components: ComponentProvider
): PlacedLayout {


    const graph =
        buildLayoutGraph(
            nodes,
            components
        );


    const positioned =
        positionNodes(nodes);



    return {

        graph,

        nodes: positioned

    };

}