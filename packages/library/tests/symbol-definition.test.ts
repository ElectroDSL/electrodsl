import { describe, expect, it } from "vitest";

import type { SymbolDefinition } from "../src";


describe("SymbolDefinition",()=>{


    it("creates resistor symbol definition",()=>{


        const resistor:SymbolDefinition={

            id:"R",

            file:"resistor.svg",

            width:80,

            height:20,


            pins:[

                {
                    id:"1",
                    name:"A",
                    number:"1",
                    electricalType:"signal",
                    direction:"bidirectional",

                    position:{
                        x:0,
                        y:10
                    }
                },


                {
                    id:"2",
                    name:"B",
                    number:"2",
                    electricalType:"signal",
                    direction:"bidirectional",

                    position:{
                        x:80,
                        y:10
                    }
                }

            ]

        };


        expect(resistor.pins.length)
            .toBe(2);


    });


});