import { describe, expect, it } from "vitest";

import {
    createLayout
} from "../src";

import {
    ComponentRegistry
} from "@electrodsl/library";


describe("LayoutEngine",()=>{


    it("creates complete placed layout",()=>{


        const registry =
            new ComponentRegistry();


        registry.register({

            id:"motor",

            name:"Motor",

            category:"motor",

            symbol:{
                file:"motor.svg",
                width:100,
                height:80
            },

            terminals:[]

        });



        const nodes:any[]=[

            {
                id:"M1",
                type:"motor",
                ports:[],
                properties:{}
            }

        ];



        const layout =
            createLayout(
                nodes,
                registry
            );


        expect(layout.graph)
            .toBeDefined();


        expect(layout.nodes)
            .toHaveLength(1);


        expect(layout.nodes[0].id)
            .toBe("M1");


    });


});