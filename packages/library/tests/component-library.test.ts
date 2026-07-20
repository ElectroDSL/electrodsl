import { describe, expect, it } from "vitest";
import { loadComponentLibrary } from "../src/index.js";

describe("ComponentLibrary", () => {

    it("loads reusable JSON component definitions", () => {

        const library = loadComponentLibrary("packages/library/library");

        expect(library.get("Motor")).toEqual({
            type: "Motor",
            pins: ["L1", "L2", "L3", "PE"],
            symbol: "motor"
        });

    });

});
