import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { analyzeConnectivity } from "../src/index.js";

describe("connectivity analysis", () => {
    it("finds isolated components and dangling cross-sheet ports", () => {
        const document = parse(`EDSL 0.8 PROJECT "P" { CIRCUIT "A" { COMPONENT R1 : IEC-RESISTOR {} COMPONENT R2 : IEC-RESISTOR {} PORT POWER; CONNECT R1.1 -> POWER; } CIRCUIT "B" { PORT POWER; } }`);
        const result = analyzeConnectivity(document);
        expect(result.totals).toMatchObject({ components: 2, electricalPaths: 1, isolatedComponents: 1, danglingPorts: 1 });
        expect(result.ports[0]).toMatchObject({ name: "POWER", connectedCircuits: ["A"], dangling: true });
    });
});
