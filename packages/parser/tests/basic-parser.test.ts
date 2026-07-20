import { describe, it, expect } from "vitest";
import { parse } from "../src/api/parse.js";


describe("ElectroDSL Parser", () => {

    it("should parse empty project", () => {

        const source = `
        PROJECT "Motor Control" {

        }
        `;


        const result = parse(source);


        expect(result.kind)
            .toBe("Document");


        expect(result.project.name)
            .toBe("Motor Control");

    });

});