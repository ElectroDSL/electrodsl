import { isPowerSymbol } from "./PowerCellDetector";
import type { ElectricalNode } from "@electrodsl/graph";

import { PowerCell } from "./PowerCell";

export function buildPowerCells(nodes: ElectricalNode[]): PowerCell[] {

    const result: PowerCell[] = [];

    for (const node of nodes) {

        if (!isPowerSymbol(node.type))
            continue;

        result.push({
            nodeId: node.id,
            x: 0,
            y: 0,
            layer: 0,
            type: "power"
        });
    }

    return result;
}