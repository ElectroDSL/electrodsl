import { describe, expect, it } from "vitest";

import { buildPowerNodes } from "../src";

describe("PowerNodeBuilder", () => {

    it("detects power nodes", () => {

        const nodes = [
            {
                id: "1",
                type: "VCC"
            },
            {
                id: "2",
                type: "Resistor"
            },
            {
                id: "3",
                type: "GND"
            }
        ] as any;

        const powerNodes = buildPowerNodes(nodes);

        expect(powerNodes).toHaveLength(2);

        expect(powerNodes[0].symbol).toBe("VCC");
        expect(powerNodes[1].symbol).toBe("GND");
    });

});