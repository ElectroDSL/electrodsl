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

    it("round-trips v0.4 engineering syntax", () => {
        const source = `EDSL 0.4 PROJECT "P" { MODULE Starter { PORT LINE; } CIRCUIT "C" { INSTANCE M1 : Starter; CABLE C1 { cores="4" size="1.5 mm2" } CONDUCTOR W1 : M1.LINE -> M1.LINE { phase="L1" } } }`;
        const formatted = format(source);
        expect(format(formatted)).toBe(formatted);
        expect(formatted).toContain("MODULE Starter");
        expect(formatted).toContain("CONDUCTOR W1 : M1.LINE -> M1.LINE");
    });
});
