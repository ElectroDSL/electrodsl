import { describe, expect, it } from "vitest";
import { parse } from "../src/index.js";

describe("NET parsing", () => {

    it("parses NET declarations with or without semicolons", () => {

        const document = parse(`EDSL 0.1
PROJECT "Power" {
    CIRCUIT "Main" {
        NET L1
        NET PE;
    }
}`);

        expect(document.project.circuits[0].nets).toEqual([
            { kind: "Net", name: "L1" },
            { kind: "Net", name: "PE" }
        ]);

    });

});
