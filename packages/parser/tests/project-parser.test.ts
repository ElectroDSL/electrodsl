import { describe, it, expect } from "vitest";
import { parse } from "../src/api/parse.js";


describe("Project parsing", () => {

    it("should read project name", () => {

        const result = parse(`
            PROJECT "Solar Inverter" {

            }
        `);


        expect(result.project.name)
            .toBe("Solar Inverter");

    });

});