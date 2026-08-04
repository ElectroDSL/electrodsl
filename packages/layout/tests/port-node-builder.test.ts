import { describe, expect, it } from "vitest";

import { buildPortNodes } from "../src";

describe("PortNodeBuilder", () => {

    it("creates two ports for each component", () => {

        const nodes = [
            {
                id: "R1",
                type: "Resistor"
            },
            {
                id: "C1",
                type: "Capacitor"
            }
        ] as any;

        const ports = buildPortNodes(nodes);

        expect(ports).toHaveLength(4);

        expect(ports[0].componentId).toBe("R1");
        expect(ports[2].componentId).toBe("C1");

    });

});