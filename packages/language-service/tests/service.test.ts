import { describe, expect, it } from "vitest";
import { ElectroDSLLanguageService } from "../src/index.js";

describe("ElectroDSL language service", () => {
    const service = new ElectroDSLLanguageService();

    it("returns zero-based editor ranges for syntax errors", () => {
        const diagnostics = service.diagnose('EDSL 0.5\nPROJECT "P" { @ }');
        expect(diagnostics[0]).toMatchObject({ code: "E1000", range: { start: { line: 1, character: 14 } } });
    });

    it("provides completions, hover help, and formatting", () => {
        expect(service.complete("cond")[0].label).toBe("CONDUCTOR");
        expect(service.hover("port")?.documentation).toContain("cross-sheet");
        expect(service.format('EDSL 0.5 PROJECT "P" { CIRCUIT "C" {} }')).toContain('    CIRCUIT "C" {');
    });
});
