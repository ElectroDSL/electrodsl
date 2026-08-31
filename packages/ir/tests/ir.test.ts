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

    it("normalizes v0.4 engineering values", () => {
        const document: DocumentNode = {
            kind: NodeKind.Document, version: "0.4",
            project: { kind: NodeKind.Project, name: "P", modules: [], circuits: [{
                kind: NodeKind.Circuit, name: "C", components: [], connections: [],
                conductors: [{ kind: NodeKind.Conductor, id: "W1",
                    from: { component: "A", pin: "1" }, to: { component: "B", pin: "1" },
                    properties: [{ kind: NodeKind.Property, name: "size", value: "1.5 mm2" }] }]
            }] }
        };
        const value = toCanonicalIR(document).project.circuits[0].electrical.conductors[0].properties.normalized.size;
        expect(value).toMatchObject({ dimension: "area", siValue: 0.0000015, siUnit: "m2" });
    });
});
