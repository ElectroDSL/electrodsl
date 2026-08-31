import { describe, expect, it } from "vitest";
import { buildLayoutCells } from "../src";

describe("LayoutCellBuilder", () => {

    it("creates one layout cell per graph node", () => {

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

        const cells = buildLayoutCells(nodes);

        expect(cells).toHaveLength(2);

        expect(cells[0].nodeId).toBe("R1");
        expect(cells[1].nodeId).toBe("C1");
    });

});