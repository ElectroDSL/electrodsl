import { describe, expect, it } from "vitest";
import { NodeKind, type DocumentNode } from "@electrodsl/ast";
import { renderSVG } from "../src/renderer.js";

const mockSymbolProvider = {
    getSymbol(type: string) {

        return `
<svg>
<rect
width="40"
height="40"
/>
</svg>
`;

    }
};
describe("SVG rendering", () => {

    it("renders IEC-style symbols, labels, and connection wires", () => {

        const document: DocumentNode = {
            kind: NodeKind.Document,
            version: "0.1",
            project: {
                kind: NodeKind.Project,
                name: "Motor Control",
                circuits: [{
                    kind: NodeKind.Circuit,
                    name: "Power",

                    components: [
                        {
                            kind: NodeKind.Component,
                            id: "Q1",
                            componentType: "Contactor",
                            properties: [],
                            pins: [
                                {
                                    name: "L1",
                                    side: "left"
                                },
                                {
                                    name: "A1",
                                    side: "right"
                                }
                            ]
                        },

                        {
                            kind: NodeKind.Component,
                            id: "M1",
                            componentType: "Motor",
                            properties: [],
                            pins: [
                                {
                                    name: "U1",
                                    side: "left"
                                },
                                {
                                    name: "V1",
                                    side: "right"
                                }
                            ]
                        }
                    ],

                    connections: [
                        {
                            kind: NodeKind.Connection,
                            from: {
                                component: "Q1",
                                pin: "L1"
                            },
                            to: {
                                component: "M1",
                                pin: "A1"
                            }
                        }
                    ]
                }]
            }
        };

        const svg =
            renderSVG(
                document,
                mockSymbolProvider
            );

        expect(svg).toContain("edsl-contactor");
        expect(svg).toContain("edsl-motor");
        expect(svg).toContain("edsl-wire");
        expect(svg).toContain(">Q1</text>");
        expect(svg).toContain(">L1</text>");
        expect(svg).toContain(">A1</text>");

    });

});
