import { describe, it, expect } from "vitest";
import { SymbolRegistry } from "../src/SymbolRegistry.js";


describe("SVG Transform", () => {


    it("applies rotation transform", () => {


        const registry = new SymbolRegistry();


        const svg =
            registry.use(
                "IEC-LAMP",
                {
                    x:100,
                    y:100,
                    rotation:90
                }
            );


        expect(svg)
            .toContain(
                "rotate(90)"
            );


    });


});