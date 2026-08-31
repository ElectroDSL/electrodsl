import { describe, expect, it } from "vitest";

import { parse } from "../src";

describe("ElectroDSL 0.2", () => {

    it("rejects unknown connection options", () => {

        expect(() => parse(`EDSL 0.2
PROJECT "Invalid" {
    CIRCUIT "Main" {
        CONNECT J1 -> J2 {
            direction = "below"
        }
    }
}`)).toThrow(SyntaxError);

    });

    it("parses nets, junctions, and route preferences", () => {

        const document = parse(`EDSL 0.2
PROJECT "Panel" {
    CIRCUIT "Control" {
        COMPONENT F1 : IEC-FUSE {}
        COMPONENT L1 : IEC-LAMP {}
        JUNCTION J1;
        NET POWER {
            F1.2;
            J1;
            L1.L;
        }
        CONNECT L1.N -> F1.1 {
            route = "below"
        }
    }
}`);

        const circuit = document.project.circuits[0];

        expect(document.version).toBe("0.2");
        expect(circuit.junctions).toEqual([
            { kind: "Junction", id: "J1" }
        ]);
        expect(circuit.nets?.[0].members).toEqual([
            { component: "F1", pin: "2" },
            { component: "J1", pin: "" },
            { component: "L1", pin: "L" }
        ]);
        expect(circuit.connections[0].route).toBe("below");

    });

});
