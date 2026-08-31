import { describe, expect, it } from "vitest";
import { format } from "../src/index.js";

describe("formatter", () => {
    it("is deterministic and idempotent", () => {
        const source = `EDSL 0.3 PROJECT "P" { CIRCUIT "C" { COMPONENT F1 : IEC-FUSE {rating="10A"} JUNCTION J1; CONNECT F1.2 -> J1 { route="below" } } }`;
        const once = format(source);
        expect(format(once)).toBe(once);
        expect(once).toContain("            rating = \"10A\"");
        expect(once).toContain("        CONNECT F1.2 -> J1 {");
    });
});
