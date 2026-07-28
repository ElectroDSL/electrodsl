import { describe, expect, it } from "vitest";

import type { Diagram } from "../src";

describe("Diagram", () => {

    it("creates an empty diagram", () => {

        const diagram: Diagram = {
            nodes: [],
            wires: [],
        };

        expect(diagram.nodes).toHaveLength(0);
        expect(diagram.wires).toHaveLength(0);

    });

});