import { describe, expect, test } from "vitest";

import {
    DuplicateComponentIdRule
} from "../src/rules/DuplicateComponentIdRule.js";


describe("Duplicate Component ID Rule", () => {


    test("detects duplicate component ids", () => {


        const document: any = {

            project: {

                circuits: [

                    {
                        name: "Main",

                        components: [

                            {
                                id: "R1",
                                componentType: "RESISTOR",
                                properties: []
                            },

                            {
                                id: "R1",
                                componentType: "CAPACITOR",
                                properties: []
                            }

                        ],

                        connections: []

                    }

                ]

            }

        };


        const rule =
            new DuplicateComponentIdRule();


        const errors =
            rule.validate(document);


        expect(errors.length)
            .toBe(1);


        expect(errors[0].code)
            .toBe("E1001");


    });


});