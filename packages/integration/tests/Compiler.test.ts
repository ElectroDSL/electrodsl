import { describe, expect, it } from "vitest";


import { compile } from "../src";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



describe("Compiler", () => {

    it("compiles an ElectroDSL file to SVG", () => {

        const source = readFileSync(
            resolve(__dirname, "../../../examples/simple.edsl"),
            "utf8"
        );

        const svg = compile(source);
        console.log(JSON.stringify(svg.substring(0, 30)));

        expect(svg.trimStart().startsWith("<svg")).toBe(true);
        expect(svg).toContain("<svg");
    });

});