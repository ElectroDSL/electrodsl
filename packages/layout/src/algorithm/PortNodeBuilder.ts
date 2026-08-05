import type { ElectricalNode } from "@electrodsl/graph";

import type { PortNode } from "../model/PortNode.js";
import { PortDirection } from "../model/PortDirection.js";

/**
 * Builds PortNodes from electrical graph nodes.
 *
 * Temporary implementation:
 * Every component gets two ports.
 */
export function buildPortNodes(
    nodes: ElectricalNode[]
): PortNode[] {

    const result: PortNode[] = [];

    for (const node of nodes) {

        result.push({
            nodeId: `${node.id}-P1`,
            componentId: node.id,
            portId: "P1",
            direction: PortDirection.Left,
            x: 0,
            y: 0,
            layer: 0
        });

        result.push({
            nodeId: `${node.id}-P2`,
            componentId: node.id,
            portId: "P2",
            direction: PortDirection.Right,
            x: 0,
            y: 0,
            layer: 0
        });

    }

    return result;

}