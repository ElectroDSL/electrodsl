import { describe, expect, it } from "vitest";

import {
    ElectricalReferenceRule,
    NetDefinitionRule,
    Validator
} from "../src";

describe("ElectroDSL 0.2 validation", () => {

    const symbols = {
        getSymbol(type: string) {
            return type === "IEC-FUSE"
                ? {
                    terminals: [
                        { id: "1", name: "1" },
                        { id: "2", name: "2" }
                    ]
                }
                : undefined;
        }
    };

    it("reports unknown terminals and undersized nets", () => {

        const document = {
            kind: "Document",
            version: "0.2",
            project: {
                kind: "Project",
                name: "Invalid",
                circuits: [{
                    kind: "Circuit",
                    name: "Main",
                    components: [{
                        kind: "Component",
                        id: "F1",
                        componentType: "IEC-FUSE",
                        type: "IEC-FUSE",
                        properties: [],
                        pins: []
                    }],
                    connections: [{
                        kind: "Connection",
                        from: { component: "F1", pin: "9" },
                        to: { component: "MISSING", pin: "1" }
                    }],
                    junctions: [],
                    nets: [{
                        kind: "Net",
                        name: "POWER",
                        members: [{ component: "F1", pin: "1" }]
                    }]
                }]
            }
        } as any;

        const result = new Validator([
            new ElectricalReferenceRule(symbols),
            new NetDefinitionRule()
        ]).validate(document);

        expect(result.errors.map(error => error.code)).toEqual([
            "E2003",
            "E2002",
            "E2102"
        ]);

    });

});
