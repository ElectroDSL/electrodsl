import type { ElectricalNode } from "@electrodsl/graph";

import type { PowerNode } from "../model/PowerNode.js";
import { isPowerNode } from "./PowerNodeDetector.js";

export function buildPowerNodes(
    nodes: ElectricalNode[]
): PowerNode[] {

    const result: PowerNode[] = [];

    for (const node of nodes) {

        if (!isPowerNode(node.type))
            continue;

        result.push({
            nodeId: node.id,
            symbol: node.type,
            x: 0,
            y: 0,
            layer: 0
        });
    }

    return result;
}