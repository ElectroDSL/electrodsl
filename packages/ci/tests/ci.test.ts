import { describe, expect, it } from "vitest";
import { qualityToJUnit, qualityToSarif } from "../src/index.js";

const quality = { project: "Panel & Door", valid: false, errors: [{ code: "E2302", message: "Missing <cable>", severity: "error" as const, source: "main.edsl", line: 4 }], warnings: [{ code: "E2304", message: "Isolated", severity: "warning" as const }] };

describe("CI quality interchange", () => {
    it("emits SARIF 2.1 with source locations", () => {
        const sarif = JSON.parse(qualityToSarif(quality));
        expect(sarif.version).toBe("2.1.0");
        expect(sarif.runs[0].results[0].locations[0].physicalLocation.artifactLocation.uri).toBe("main.edsl");
    });
    it("emits escaped JUnit XML", () => {
        const junit = qualityToJUnit(quality);
        expect(junit).toContain('failures="1"');
        expect(junit).toContain("Panel &amp; Door");
        expect(junit).toContain("Missing &lt;cable&gt;");
    });
});
