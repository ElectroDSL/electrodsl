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

        const nodes = graph.getNodes()
        .filter(node => node.type !== "__junction__")
        .map(node => {

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

        const obstacles = graph.getNodes()
            .filter(node => node.type !== "__junction__")
            .map(node => {
                const position = nodeLookup.get(node.id);
                const size = this.symbolSize(node.type);
                return {
                    id: node.id,
                    x: position?.x ?? 0,
                    y: position?.y ?? 0,
                    width: size.width,
                    height: size.height
                };
            });

        const junctions = graph.getNodes()
            .filter(node => node.type === "__junction__")
            .map(node => {
                const position = nodeLookup.get(node.id);
                return {
                    id: node.id,
                    x: position?.x ?? 0,
                    y: position?.y ?? 0
                };
            });

        const wires = graph.getEdges().map((edge, index) => {

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

            const start = source && sourceNode
                ? this.terminalPoint(
                    sourceNode.type,
                    portNameFromPortId(edge.sourcePortId),
                    source
                )
                : undefined;

            const end = target && targetNode
                ? this.terminalPoint(
                    targetNode.type,
                    portNameFromPortId(edge.targetPortId),
                    target
                )
                : undefined;

            const route = readRoute(edge.metadata?.route);

            return {

                id: edge.id,

                from: edge.sourcePortId,

                to: edge.targetPortId,

                net: typeof edge.metadata?.net === "string"
                    ? edge.metadata.net
                    : undefined,

                route,

                points: start && end && source && target
                    ? obstacleAwareRoute(
                        start,
                        end,
                        source.x,
                        target.x,
                        route,
                        index,
                        obstacles.filter(obstacle =>
                            obstacle.id !== sourceNode?.id &&
                            obstacle.id !== targetNode?.id
                        )
                    )
                    : undefined

            };

        });

        return {

            nodes,

            wires,

            labels: [],

            junctions,

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

        if (componentType === "__junction__") {
            return {
                x: position.x,
                y: position.y
            };
        }

        return {
            x: position.x + (symbol?.width ?? componentWidth) / 2,
            y: position.y + (symbol?.height ?? componentHeight) / 2
        };

    }

    private symbolSize(
        componentType: string
    ): { width: number; height: number } {
        const symbol = this.terminalProvider?.getSymbol(componentType);
        return {
            width: symbol?.width ?? componentWidth,
            height: symbol?.height ?? componentHeight
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

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
}

function obstacleAwareRoute(
    start: { x: number; y: number },
    end: { x: number; y: number },
    sourceX: number,
    targetX: number,
    preference: "auto" | "above" | "below",
    lane: number,
    obstacles: Obstacle[]
): Array<{ x: number; y: number }> {

    const outerY = preference === "above"
        ? Math.max(20, Math.min(start.y, end.y) - 40 - lane * 20)
        : Math.max(
            start.y,
            end.y,
            ...obstacles.map(item => item.y + item.height)
        ) + 40 + lane * 20;

    if (preference !== "auto") {
        return channelRoute(start, end, outerY);
    }

    const candidate = routePoints(start, end, sourceX, targetX);

    return pathHitsObstacle(candidate, obstacles)
        ? channelRoute(start, end, outerY)
        : candidate;
}

function channelRoute(
    start: { x: number; y: number },
    end: { x: number; y: number },
    y: number
): Array<{ x: number; y: number }> {
    return [
        start,
        { x: start.x, y },
        { x: end.x, y },
        end
    ];
}

function pathHitsObstacle(
    points: Array<{ x: number; y: number }>,
    obstacles: Obstacle[]
): boolean {
    for (let index = 1; index < points.length; index += 1) {
        if (obstacles.some(obstacle =>
            segmentHitsObstacle(points[index - 1], points[index], obstacle)
        )) {
            return true;
        }
    }
    return false;
}

function segmentHitsObstacle(
    start: { x: number; y: number },
    end: { x: number; y: number },
    obstacle: Obstacle
): boolean {
    const clearance = 20;
    const left = obstacle.x - clearance;
    const right = obstacle.x + obstacle.width + clearance;
    const top = obstacle.y - clearance;
    const bottom = obstacle.y + obstacle.height + clearance;

    if (start.y === end.y) {
        return start.y >= top && start.y <= bottom &&
            Math.max(start.x, end.x) >= left &&
            Math.min(start.x, end.x) <= right;
    }

    if (start.x === end.x) {
        return start.x >= left && start.x <= right &&
            Math.max(start.y, end.y) >= top &&
            Math.min(start.y, end.y) <= bottom;
    }

    return false;
}

function readRoute(
    value: unknown
): "auto" | "above" | "below" {
    return value === "above" || value === "below"
        ? value
        : "auto";
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
