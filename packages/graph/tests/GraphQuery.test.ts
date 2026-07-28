import { describe, expect, it } from "vitest";

import {
    DefaultElectricalGraph,
    GraphQuery
} from "../src";


describe("GraphQuery", () => {


    it("should find neighbors", () => {


        const graph =
            new DefaultElectricalGraph();


        graph.addNode({
            id: "Q1",
            type: "breaker",
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
            sourcePortId: "Q1:T1",
            targetPortId: "M1:L1",
            type: "wire"
        });



        const query =
            new GraphQuery(graph);



        const neighbors =
            query.getNeighbors("Q1");


        expect(neighbors)
            .toHaveLength(1);


        expect(neighbors[0].id)
            .toBe("M1");

    });


});