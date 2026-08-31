import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { EngineeringSemanticsRule } from "../src/index.js";

describe("EngineeringSemanticsRule", () => {
    it("accepts typed values, phases, designations, and known modules", () => {
        const document = parse(`EDSL 0.4 PROJECT "P" {
            MODULE Starter { PORT LINE; COMPONENT F1 : IEC-FUSE { designation = "=P1+CC1-F1" } }
            CIRCUIT "C" { INSTANCE M1 : Starter; CABLE C1 { cores = "4" size = "1.5 mm2" }
                BUS B1 { phases = "L1,N,PE" M1.LINE; M1.LINE; } }
        }`);
        expect(new EngineeringSemanticsRule().validate(document)).toEqual([]);
    });

    it("reports invalid units, phase names, designations, and modules", () => {
        const document = parse(`EDSL 0.4 PROJECT "P" { CIRCUIT "C" {
            COMPONENT F1 : IEC-FUSE { designation = "bad" }
            INSTANCE M1 : Missing;
            CABLE C1 { cores = "four" size = "1.5 bananas" }
            BUS B1 { phases = "L4" F1.1; F1.2; }
        } }`);
        const codes = new EngineeringSemanticsRule().validate(document).map(error => error.code);
        expect(codes).toEqual(expect.arrayContaining(["E2202", "E2203", "E2204", "E2205"]));
    });
});
