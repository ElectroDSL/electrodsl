import type { ElectricalGraph } from "@electrodsl/graph";
import type { LayoutResult } from "@electrodsl/layout";

import type { Diagram } from "../model/Diagram.js";

export class DiagramBuilder {

    build(
        graph: ElectricalGraph,
        layout: LayoutResult[]
    ): Diagram {

        const nodeLookup = new Map(
            layout.map(item => [item.node.id, item])
        );

        const nodes = graph.getNodes().map(node => {

            const position = nodeLookup.get(node.id);

            return {
                id: node.id,
                symbol: node.type,
                x: position?.x ?? 0,
                y: position?.y ?? 0,
                rotation: 0,
                metadata: node.metadata
            };

        });

        const wires = graph.getEdges().map(edge => ({

            id: edge.id,

            from: edge.sourcePortId,

            to: edge.targetPortId

        }));

        return {

            nodes,

            wires,

            labels: [],

            junctions: [],

            metadata: {},

            viewport: {

                width: 1000,

                height: 1000

            }

        };

    }

}