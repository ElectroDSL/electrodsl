import {
    describe,
    expect,
    it
} from "vitest";


import {
    DefaultElectricalGraph
} from "@electrodsl/graph";


import {
    LayerCalculator
} from "../src";


describe("LayerCalculator", () => {


    it("should assign same layer for parallel branches", () => {


        const graph =
            new DefaultElectricalGraph();



        graph.addNode({

            id: "Q1",

            type: "breaker",

            ports: [],

            properties: {}

        });



        graph.addNode({

            id: "K1",

            type: "contactor",

            ports: [],

            properties: {}

        });



        graph.addNode({

            id: "K2",

            type: "contactor",

            ports: [],

            properties: {}

        });



        graph.addEdge({

            id: "E1",

            sourcePortId: "Q1:A",

            targetPortId: "K1:A",

            type: "wire"

        });



        graph.addEdge({

            id: "E2",

            sourcePortId: "Q1:B",

            targetPortId: "K2:A",

            type: "wire"

        });



        const calculator =
            new LayerCalculator(graph);



        const layers =
            calculator.calculate("Q1");



        expect(layers.get("Q1"))
            .toBe(0);



        expect(layers.get("K1"))
            .toBe(1);



        expect(layers.get("K2"))
            .toBe(1);


    });


});