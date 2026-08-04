import { describe, expect, it } from "vitest";

import { buildLayoutGraph } from "../src";

describe("LayoutGraphBuilder", () => {

    it("builds a complete layout graph", () => {

        const nodes = [

            {
                id: "R1",
                type: "Resistor"
            },

            {
                id: "VCC",
                type: "VCC"
            }

        ] as any;

        const graph = buildLayoutGraph(nodes);

        expect(graph.cells.length).toBe(2);

        expect(graph.powerNodes.length).toBe(1);

        expect(graph.portNodes.length).toBe(4);

    });

});