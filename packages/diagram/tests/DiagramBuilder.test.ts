import { describe, expect, it } from "vitest";

import {
    DefaultElectricalGraph
} from "@electrodsl/graph";

import {
    DiagramBuilder
} from "../src";

describe("DiagramBuilder", () => {

    it("routes wires between placed nodes", () => {

        const graph = new DefaultElectricalGraph();

        graph.addNode({
            id: "Q1",
            type: "breaker",
            ports: [],
            properties: {}
        });

        graph.addNode({
            id: "M1",
            type: "motor",
            ports: [],
            properties: {}
        });

        graph.addEdge({
            id: "Q1:T1->M1:L1",
            sourcePortId: "Q1:T1",
            targetPortId: "M1:L1",
            type: "wire"
        });

        graph.addEdge({
            id: "M1:T1->Q1:L1",
            sourcePortId: "M1:T1",
            targetPortId: "Q1:L1",
            type: "wire"
        });

        const terminalProvider = {
            getSymbol() {
                return {
                    width: 80,
                    height: 80,
                    terminals: [
                        {
                            id: "L1",
                            name: "L1",
                            position: { x: 0, y: 40 }
                        },
                        {
                            id: "T1",
                            name: "T1",
                            position: { x: 80, y: 40 }
                        }
                    ]
                };
            }
        };

        const diagram = new DiagramBuilder(terminalProvider).build(
            graph,
            [
                {
                    node: graph.getNode("Q1")!,
                    x: 100,
                    y: 200,
                    layer: 0,
                    order: 0
                },
                {
                    node: graph.getNode("M1")!,
                    x: 300,
                    y: 400,
                    layer: 1,
                    order: 0
                }
            ]
        );

        expect(diagram.wires[0].points).toEqual([
            { x: 180, y: 240 },
            { x: 240, y: 240 },
            { x: 240, y: 440 },
            { x: 300, y: 440 }
        ]);

        expect(diagram.wires[1].points).toEqual([
            { x: 380, y: 440 },
            { x: 380, y: 520 },
            { x: 100, y: 520 },
            { x: 100, y: 240 }
        ]);

    });

});
