import { describe, expect, it } from "vitest";

import {
    DefaultElectricalGraph,
    GraphValidator
} from "../src";

describe("GraphValidator", () => {
it("should reject missing ports", () => {

    const graph = new DefaultElectricalGraph();


    graph.addNode({

        id: "Q1",

        type: "breaker",

        ports: [
            {
                id: "Q1:L1",
                nodeId: "Q1",
                name: "L1"
            }
        ],

        properties: {}

    });


    graph.addNode({

        id: "M1",

        type: "motor",

        ports: [
            {
                id: "M1:L1",
                nodeId: "M1",
                name: "L1"
            }
        ],

        properties: {}

    });



    graph.addEdge({

        id: "E1",

        sourcePortId: "Q1:T99",

        targetPortId: "M1:L1",

        type: "wire"

    });



    const result =
        new GraphValidator().validate(graph);



    expect(result.valid).toBe(false);

    expect(result.errors[0])
        .toContain("T99");

});
});