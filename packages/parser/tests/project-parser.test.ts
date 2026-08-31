import { describe, expect, test } from "vitest";
import { parse } from "../src/api/parse.js";


describe("Project Parser", () => {


    test("parses project declaration", () => {


        const source = `EDSL 0.1
PROJECT "motor-control" {
    CIRCUIT "main" {
    }
}`;


        const result = parse(source);


        expect(result.kind)
            .toBe("Document");


        expect(result.project.name)
            .toBe("motor-control");


        expect(result.project.circuits.length)
            .toBe(1);


        expect(result.project.circuits[0].name)
            .toBe("main");


    });


});
