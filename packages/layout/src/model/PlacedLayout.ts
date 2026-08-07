import type { LayoutGraph } from "./LayoutGraph.js";
import type { PositionedNode } from "./PositionedNode.js";


/**
 * Complete layout result.
 */
export interface PlacedLayout {

    /**
     * Logical layout graph.
     */
    graph: LayoutGraph;


    /**
     * Components with drawing coordinates.
     */
    nodes: PositionedNode[];

}