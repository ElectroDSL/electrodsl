import { describe, expect, it } from "vitest";
import { checkLanguageCompatibility, compileSvg, parseDocument, TOOLCHAIN_VERSION, validateDocument } from "../src/index.js";

const source = `EDSL 1.0 PROJECT "Stable" { CIRCUIT "Main" { COMPONENT R1 : IEC-RESISTOR {} COMPONENT R2 : IEC-RESISTOR {} CONNECT R1.1 -> R2.1; } }`;

describe("ElectroDSL 1.0 stable public API", () => {
    it("parses, validates, and compiles through one entry point", () => {
        const document = parseDocument(source);
        expect(validateDocument(document).valid).toBe(true);
        expect(compileSvg(source)).toContain("<svg");
        expect(TOOLCHAIN_VERSION).toBe("1.0.0");
    });
    it("publishes the compatibility contract", () => {
        expect(checkLanguageCompatibility("1.0").stability).toBe("stable");
        expect(checkLanguageCompatibility("0.1").stability).toBe("legacy");
        expect(checkLanguageCompatibility("2.0").compatible).toBe(false);
    });
});
