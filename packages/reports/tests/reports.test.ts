import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { generateProductionReport, reportCsvFiles } from "../src/index.js";

const source = `EDSL 0.6 PROJECT "Panel" {
    MODULE Lamp { PORT LINE; PORT RETURN; COMPONENT L1 : IEC-LAMP { voltage = "230 V" } CONDUCTOR WI : LINE -> L1.L { size = "1.5 mm2" } }
    CIRCUIT "Supply" { PORT POWER; COMPONENT F1 : IEC-FUSE { rating = "10 A" } CONDUCTOR W1 : F1.2 -> POWER { size = "1.5 mm2" cable = "C1" } CABLE C1 { cores = "4" } }
    CIRCUIT "Door" { PORT POWER; INSTANCE X1 : Lamp; CONDUCTOR W2 : POWER -> X1.LINE { size = "1.5 mm2" } }
}`;

describe("production reports", () => {
    it("builds deterministic project-wide schedules including module expansion", () => {
        const report = generateProductionReport(parse(source));
        expect(report.bom).toEqual(expect.arrayContaining([
            expect.objectContaining({ type: "IEC-FUSE", quantity: 1 }),
            expect.objectContaining({ type: "IEC-LAMP", quantity: 1, references: ["X1/L1"] })
        ]));
        expect(report.conductors.map(row => row.id)).toEqual(["W2", "X1/WI", "W1"]);
        expect(report.crossReferences).toContainEqual({ name: "POWER", kind: "port", locations: ["Door", "Supply"] });
        expect(reportCsvFiles(report)["bom.csv"]).toContain("IEC-FUSE");
    });
});
