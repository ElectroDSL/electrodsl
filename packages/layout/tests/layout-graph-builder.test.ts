import { describe, expect, it } from "vitest";

import { buildLayoutGraph } from "../src";

import {
    ComponentRegistry
} from "@electrodsl/library";

const registry =
    new ComponentRegistry();


registry.register({

    id:"Resistor",

    name:"Resistor",

    category:"passive",

    symbol:{
        file:"resistor.svg",
        width:80,
        height:20
    },

    terminals:[

        {
            id:"A",
            name:"Terminal A",
            electricalType:"signal",
            direction:"input",
            position:{
                x:0,
                y:10
            }
        },

        {
            id:"B",
            name:"Terminal B",
            electricalType:"signal",
            direction:"output",
            position:{
                x:80,
                y:10
            }
        }

    ]

});


registry.register({

    id:"VCC",

    name:"VCC",

    category:"power",

    symbol:{
        file:"vcc.svg",
        width:40,
        height:40
    },

    terminals:[

        {
            id:"P",
            name:"Positive",
            electricalType:"power",
            direction:"output",
            position:{
                x:20,
                y:0
            }
        },

        {
            id:"GND",
            name:"Ground",
            electricalType:"earth",
            direction:"bidirectional",
            position:{
                x:20,
                y:40
            }
        }

    ]

});
describe("LayoutGraphBuilder", () => {

    it("builds a complete layout graph", () => {

        const nodes = [

            {
                id: "R1",
                type: "Resistor"
            },

            {
                id: "VCC",
                type: "VCC"
            }

        ] as any;

        const graph = buildLayoutGraph(
            nodes,
            registry
        );

        expect(graph.cells.length).toBe(2);

        expect(graph.powerNodes.length).toBe(1);

        expect(graph.portNodes.length).toBe(4);

    });

});