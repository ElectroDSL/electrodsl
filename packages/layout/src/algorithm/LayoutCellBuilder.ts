import type { GraphNode } from "@electrodsl/graph";
import type { LayoutCell } from "../model/LayoutCell.js";

export function buildLayoutCells(
    nodes: GraphNode[]
): LayoutCell[] {

    return nodes.map((node, index) => ({
        id: `cell-${index}`,
        nodeId: node.id,
        row: index,
        column: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 80
    }));
}