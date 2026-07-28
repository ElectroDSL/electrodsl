import {
    describe,
    expect,
    it
} from "vitest";


import {
    DefaultElectricalGraph
} from "@electrodsl/graph";


import {
    autoLayout
} from "../src";



describe("AutoLayout", () => {


    it("should generate coordinates from graph topology", () => {


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

            id: "M1",

            type: "motor",

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

            sourcePortId: "K1:A",

            targetPortId: "M1:A",

            type: "wire"

        });



        const result =
            autoLayout(
                graph,
                "Q1"
            );



        const q1 =
            result.find(
                x => x.node.id === "Q1"
            );


        const k1 =
            result.find(
                x => x.node.id === "K1"
            );


        const m1 =
            result.find(
                x => x.node.id === "M1"
            );



        expect(q1?.layer)
            .toBe(0);


        expect(k1?.layer)
            .toBe(1);


        expect(m1?.layer)
            .toBe(2);



        expect(k1?.x)
            .toBe(250);


        expect(m1?.x)
            .toBe(500);


    });


});