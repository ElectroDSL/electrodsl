import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { ElectricalIntegrityRule } from "../src/rules/ElectricalIntegrityRule.js";

describe("v0.8 electrical integrity", () => {
    it("detects unsafe paths and cable over-allocation", () => {
        const document = parse(`EDSL 0.8 PROJECT "P" { CIRCUIT "C" { COMPONENT R1 : IEC-RESISTOR {} COMPONENT R2 : IEC-RESISTOR {} CABLE C1 { cores = "1" } CONDUCTOR W1 : R1.1 -> R2.1 { cable = "C1" } CONDUCTOR W2 : R2.1 -> R1.1 { cable = "C1" } CONDUCTOR W3 : R1.2 -> R1.2 { cable = "MISSING" } } }`);
        const codes = new ElectricalIntegrityRule().validate(document).map(item => item.code);
        expect(codes).toEqual(expect.arrayContaining(["E2300", "E2301", "E2302", "E2303"]));
    });
});
