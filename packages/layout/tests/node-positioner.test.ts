import { describe, expect, it } from "vitest";

import {
    positionNodes
} from "../src";


describe("NodePositioner",()=>{


    it("assigns coordinates to nodes",()=>{


        const nodes = [

            {
                id:"Q1",
                type:"breaker"
            },

            {
                id:"M1",
                type:"motor"
            }

        ] as any;



        const positioned =
            positionNodes(nodes);



        expect(positioned)
            .toHaveLength(2);



        expect(positioned[0].x)
            .toBe(0);



        expect(positioned[1].x)
            .toBe(200);


    });


});