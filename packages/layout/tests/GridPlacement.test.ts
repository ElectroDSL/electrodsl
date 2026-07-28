import {
    describe,
    expect,
    it
} from "vitest";


import {
    DefaultElectricalGraph
} from "@electrodsl/graph";


import {
    GridPlacement
} from "../src";



describe("GridPlacement", () => {


    it("should place nodes according to layers", () => {


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



        const layers =
            new Map<string, number>([

                ["Q1",0],

                ["K1",1],

                ["K2",1]

            ]);



        const placer =
            new GridPlacement();



        const result =
            placer.place(
                graph.getNodes() as any[],
                layers
            );



        const q1 =
            result.find(
                x => x.node.id === "Q1"
            );


        const k1 =
            result.find(
                x => x.node.id === "K1"
            );


        const k2 =
            result.find(
                x => x.node.id === "K2"
            );



        expect(q1?.x)
            .toBe(0);



        expect(k1?.x)
            .toBe(250);



        expect(k2?.x)
            .toBe(250);



        expect(k1?.y)
            .not
            .toBe(k2?.y);


    });


});