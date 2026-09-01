import { describe, expect, it } from "vitest";
import { buildGenerationPrompt, reviewDesign } from "../src/index.js";

const source = `EDSL 0.5 PROJECT "P" { CIRCUIT "C" {
    COMPONENT F1 : IEC-FUSE {}
    COMPONENT L1 : IEC-LAMP {}
    CONDUCTOR W1 : F1.2 -> L1.L { size = "1.5 mm2" phase = "L1" }
} }`;

describe("AI tools", () => {
    it("builds constrained, safety-aware generation prompts", () => {
        const prompt = buildGenerationPrompt("A fused indicator", ["IEC-FUSE", "IEC-LAMP"]);
        expect(prompt).toContain("ElectroDSL 0.5");
        expect(prompt).toContain("qualified electrical engineer");
    });

    it("reviews, explains, and suggests without claiming safety certification", () => {
        const review = reviewDesign(source);
        expect(review.valid).toBe(true);
        expect(review.explanation?.summary).toContain("2 placed component");
        expect(review.explanation?.disclaimer).toContain("not a certification");
    });
});
