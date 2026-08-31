import type { ElectricalGraph } from "@electrodsl/graph";
import type { LayoutResult } from "@electrodsl/layout";

import type { Diagram } from "../model/Diagram.js";

interface TerminalProvider {
    getSymbol(type: string): {
        width: number;
        height: number;
        terminals?: Array<{
            id: string;
            name: string;
            position: { x: number; y: number };
        }>;
    } | undefined;
}

export class DiagramBuilder {

    constructor(
        private readonly terminalProvider?: TerminalProvider
    ) {}

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

        const wires = graph.getEdges().map(edge => {

            const source = nodeLookup.get(
                nodeIdFromPortId(edge.sourcePortId)
            );

            const target = nodeLookup.get(
                nodeIdFromPortId(edge.targetPortId)
            );

            const sourceNode = graph.getNode(
                nodeIdFromPortId(edge.sourcePortId)
            );

            const targetNode = graph.getNode(
                nodeIdFromPortId(edge.targetPortId)
            );

            return {

                id: edge.id,

                from: edge.sourcePortId,

                to: edge.targetPortId,

                points: source && target && sourceNode && targetNode
                    ? routePoints(
                        this.terminalPoint(
                            sourceNode.type,
                            portNameFromPortId(edge.sourcePortId),
                            source
                        ),
                        this.terminalPoint(
                            targetNode.type,
                            portNameFromPortId(edge.targetPortId),
                            target
                        ),
                        source.x,
                        target.x
                    )
                    : undefined

            };

        });

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

    private terminalPoint(
        componentType: string,
        terminalName: string,
        position: { x: number; y: number }
    ): { x: number; y: number } {

        const symbol =
            this.terminalProvider?.getSymbol(componentType);

        const terminal = symbol?.terminals?.find(
            item => item.id === terminalName || item.name === terminalName
        );

        if (terminal) {

            return {
                x: position.x + terminal.position.x,
                y: position.y + terminal.position.y
            };

        }

        return {
            x: position.x + (symbol?.width ?? componentWidth) / 2,
            y: position.y + (symbol?.height ?? componentHeight) / 2
        };

    }

}

const componentWidth = 80;
const componentHeight = 80;

function routePoints(
    start: { x: number; y: number },
    end: { x: number; y: number },
    sourceX: number,
    targetX: number
): Array<{ x: number; y: number }> {

    if (targetX < sourceX) {

        const channelY =
            Math.max(start.y, end.y) + componentHeight;

        return [
            start,
            { x: start.x, y: channelY },
            { x: end.x, y: channelY },
            end
        ];

    }

    if (start.x === end.x || start.y === end.y) {
        return [start, end];
    }

    const middleX =
        Math.round((start.x + end.x) / 2);

    return [
        start,
        { x: middleX, y: start.y },
        { x: middleX, y: end.y },
        end
    ];

}

function nodeIdFromPortId(
    portId: string
): string {

    const separator = portId.indexOf(":");

    return separator === -1
        ? portId
        : portId.slice(0, separator);

}

function portNameFromPortId(
    portId: string
): string {

    const separator = portId.indexOf(":");

    return separator === -1
        ? portId
        : portId.slice(separator + 1);

}
