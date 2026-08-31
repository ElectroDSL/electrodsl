import { describe, expect, it } from "vitest";

import {
    buildPortNodes
} from "../src";


import {
    ComponentRegistry
} from "@electrodsl/library";


describe("PortNodeBuilder", () => {


    it("creates ports from component terminals", () => {


        const registry =
            new ComponentRegistry();



        registry.register({

            id:"resistor",

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



        const nodes = [

            {

                id:"R1",

                type:"resistor",

                ports:[],

                properties:{}

            }

        ];



        const ports =
            buildPortNodes(
                nodes,
                registry
            );



        expect(ports)
            .toHaveLength(2);



        expect(ports[0].componentId)
            .toBe("R1");


        expect(ports[0].portId)
            .toBe("A");


        expect(ports[1].portId)
            .toBe("B");


    });


});