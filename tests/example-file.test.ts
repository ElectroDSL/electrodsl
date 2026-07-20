import { describe, it, expect } from "vitest";
import { parseFile } from "../src/api/parseFile.js";


describe("Example files",()=>{


    it("should parse motor.edsl",()=>{


        const result = parseFile(
            "../../examples/motor.edsl"
        );


        expect(result.project.name)
            .toBe("Motor Control");


    });


});