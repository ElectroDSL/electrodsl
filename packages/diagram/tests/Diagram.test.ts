import { describe, expect, it } from "vitest";

import type { Diagram } from "../src";

describe("Diagram", () => {

    it("creates an empty diagram", () => {

        const diagram: Diagram = {

            nodes: [],

            wires: [],

            labels: [],

            junctions: [],

            metadata: {},

            viewport: {

                width: 1000,

                height: 1000

            }

        };

        expect(diagram.nodes).toHaveLength(0);
        expect(diagram.wires).toHaveLength(0);
        expect(diagram.labels).toHaveLength(0);
        expect(diagram.junctions).toHaveLength(0);

    });

});