import { describe, expect, it } from "vitest";
import { parse } from "../src/index.js";

describe("ElectroDSL 0.4", () => {
    it("parses engineering declarations, modules, and sheet ports", () => {
        const document = parse(`EDSL 0.4
PROJECT "Panel" {
    MODULE Starter {
        PORT LINE;
        PORT LOAD;
        COMPONENT F1 : IEC-FUSE { designation = "=P1+CC1-F1" }
        CONNECT LINE -> F1.1;
        CONNECT F1.2 -> LOAD;
    }
    CIRCUIT "Main" {
        PORT SUPPLY;
        COMPONENT L1 : IEC-LAMP {}
        INSTANCE M1 : Starter;
        CABLE C1 { cores = "4" size = "1.5 mm2" }
        CONDUCTOR W1 : SUPPLY -> M1.LINE { size = "1.5 mm2" phase = "L1" cable = "C1" }
        BUS RETURN { phases = "N,PE"; M1.LOAD; L1.N; }
    }
}`);
        const circuit = document.project.circuits[0];
        expect(document.project.modules?.[0].ports).toHaveLength(2);
        expect(circuit.conductors?.[0]).toMatchObject({ id: "W1", from: { component: "SUPPLY", pin: "" } });
        expect(circuit.buses?.[0].members).toHaveLength(2);
        expect(circuit.instances?.[0]).toMatchObject({ id: "M1", module: "Starter" });
    });
});
