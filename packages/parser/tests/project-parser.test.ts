import { describe, expect, test } from "vitest";
import { parse } from "../src/api/parse.js";


describe("Project Parser", () => {


    test("parses project declaration", () => {


        const source = `

project "motor-control"
{

    circuit "main"

}


        `;


        const result = parse(source);


        expect(result.type)
            .toBe("Project");


        expect(result.name)
            .toBe("motor-control");


        expect(result.circuits.length)
            .toBe(1);


        expect(result.circuits[0].name)
            .toBe("main");


    });


});