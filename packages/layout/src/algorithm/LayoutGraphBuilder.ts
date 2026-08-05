import type { ElectricalNode } from "@electrodsl/graph";

import type { LayoutGraph } from "../model/LayoutGraph.js";

import { buildLayoutCells } from "./LayoutCellBuilder.js";
import { buildPowerNodes } from "./PowerNodeBuilder.js";
import { buildPortNodes } from "./PortNodeBuilder.js";

/**
 * Builds a complete LayoutGraph.
 */
export function buildLayoutGraph(
    nodes: ElectricalNode[]
): LayoutGraph {

    return {

        cells: buildLayoutCells(nodes),

        powerNodes: buildPowerNodes(nodes),

        portNodes: buildPortNodes(nodes)

    };

}