import {describe,it,expect} from "vitest";
import {createAISchematic} from "../src";


describe("AI Schema",()=>{

it("creates empty AI schematic",()=>{

const design=createAISchematic();

expect(design.design.application)
.toBe("unknown");

});

});