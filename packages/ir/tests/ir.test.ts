import { describe, expect, it } from "vitest";
import { NodeKind, type DocumentNode } from "@electrodsl/ast";
import { CANONICAL_IR_SCHEMA, toCanonicalIR } from "../src/index.js";

describe("canonical IR", () => {
    it("separates electrical connectivity from presentation preferences", () => {
        const document: DocumentNode = {
            kind: NodeKind.Document,
            version: "0.3",
            project: {
                kind: NodeKind.Project,
                name: "Panel",
                circuits: [{
                    kind: NodeKind.Circuit,
                    name: "Main",
                    components: [],
                    junctions: [{ kind: NodeKind.Junction, id: "J1" }],
                    nets: [],
                    connections: [{
                        kind: NodeKind.Connection,
                        from: { component: "J1", pin: "" },
                        to: { component: "J2", pin: "" },
                        route: "below"
                    }]
                }]
            }
        };

        const ir = toCanonicalIR(document);
        expect(ir.$schema).toBe(CANONICAL_IR_SCHEMA);
        expect(ir.project.circuits[0].electrical.connections[0]).toEqual({
            from: { component: "J1" }, to: { component: "J2" }
        });
        expect(ir.project.circuits[0].presentation.routes[0].preference).toBe("below");
    });
});
