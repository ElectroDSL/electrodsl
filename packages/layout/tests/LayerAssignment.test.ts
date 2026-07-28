import {
    describe,
    expect,
    it
} from "vitest";


import {
    DefaultElectricalGraph
} from "@electrodsl/graph";


import {
    LayerAssignment
} from "../src";


describe("LayerAssignment", () => {


    it("should assign layers based on graph order", () => {


        const graph =
            new DefaultElectricalGraph();



        for (const id of [
            "Q1",
            "K1",
            "M1"
        ]) {


            graph.addNode({

                id,

                type: "component",

                ports: [],

                properties: {}

            });

        }



        graph.addEdge({

            id: "E1",

            sourcePortId: "Q1:A",

            targetPortId: "K1:A",

            type: "wire"

        });



        graph.addEdge({

            id: "E2",

            sourcePortId: "K1:B",

            targetPortId: "M1:A",

            type: "wire"

        });



        const layout =
            new LayerAssignment(graph);



        const result =
            layout.assign("Q1");



        expect(result[0].layer)
            .toBe(0);



        expect(result[1].layer)
            .toBe(1);



        expect(result[2].layer)
            .toBe(2);



    });


});