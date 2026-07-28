import { describe, expect, it } from "vitest";

import {
    DefaultElectricalGraph,
    GraphTraversal
} from "../src";


describe("GraphTraversal", () => {


    it("should perform BFS traversal", () => {


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



        const traversal =
            new GraphTraversal(graph);



        const result =
            traversal.bfs("Q1");



        expect(
            result.map(n => n.id)
        )
        .toEqual([
            "Q1",
            "K1",
            "M1"
        ]);

    });


});