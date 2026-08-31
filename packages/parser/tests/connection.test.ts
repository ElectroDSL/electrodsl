import { describe, expect, it } from "vitest";

import { parse } from "../src";

describe("Connection parsing", () => {

    it("preserves numeric and named terminal identifiers", () => {

        const document = parse(`EDSL 0.1
PROJECT "Connections" {
    CIRCUIT "Main" {
        COMPONENT F1 : IEC-FUSE {}
        COMPONENT L1 : IEC-LAMP {}
        CONNECT F1.2 -> L1.L;
        CONNECT L1.N -> F1.1;
    }
}`);

        expect(document.project.circuits[0].connections).toEqual([
            {
                kind: "Connection",
                from: { component: "F1", pin: "2" },
                to: { component: "L1", pin: "L" }
            },
            {
                kind: "Connection",
                from: { component: "L1", pin: "N" },
                to: { component: "F1", pin: "1" }
            }
        ]);

    });

});
