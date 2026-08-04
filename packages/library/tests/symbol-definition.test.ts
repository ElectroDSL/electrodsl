import { describe, expect, it } from "vitest";

import { PortSide } from "../src";
import type { SymbolDefinition } from "../src";

describe("SymbolDefinition", () => {

    it("creates a resistor symbol", () => {

        const resistor: SymbolDefinition = {

            name: "Resistor",

            category: "Passive",

            bounds: {

                width: 80,

                height: 20

            },

            ports: [

                {

                    id: "1",

                    name: "A",

                    side: PortSide.Left,

                    x: 0,

                    y: 10

                },

                {

                    id: "2",

                    name: "B",

                    side: PortSide.Right,

                    x: 80,

                    y: 10

                }

            ]

        };

        expect(resistor.ports.length).toBe(2);

    });

});