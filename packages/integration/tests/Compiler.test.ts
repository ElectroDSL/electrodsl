import { describe, expect, it } from "vitest";

import { compile } from "../src";

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Compiler", () => {

    it("renders 0.2 named nets and junctions", () => {

        const source = readFileSync(
            resolve(
                __dirname,
                "../../../examples/v02-panel.edsl"
            ),
            "utf8"
        );

        const svg = compile(source);

        expect(svg).toContain("POWER");
        expect(svg).toContain("RETURN");
        expect(svg.match(/class="edsl-junction"/g)).toHaveLength(2);
        expect(svg).not.toContain('stroke="red"');

    });

    it("connects wires to library terminal coordinates", () => {

        const source = `EDSL 0.1
PROJECT "Terminal Routing" {
    CIRCUIT "Main" {
        COMPONENT F1 : IEC-FUSE {}
        COMPONENT L1 : IEC-LAMP {}
        CONNECT F1.2 -> L1.L;
        CONNECT L1.N -> F1.1;
    }
}`;

        const svg = compile(source);

        expect(svg).toContain(
            'd="M 100 50 L 175 50 L 175 40 L 250 40"'
        );

        expect(svg).toContain(
            'd="M 330 40 L 330 130 L 0 130 L 0 50"'
        );

    });

    it("compiles an ElectroDSL file to SVG", () => {

        const source = readFileSync(
            resolve(
                __dirname,
                "../../../examples/simple.edsl"
            ),
            "utf8"
        );

        const svg = compile(source);

        expect(svg.trimStart().startsWith("<svg")).toBe(true);

        expect(svg).toContain("<svg");

        // Component labels
        expect(svg).toContain("P1");
        expect(svg).toContain("M1");
        expect(svg).toContain("L1");

        // SVG symbol/group content
        expect(svg).toContain("<g");

        // Electrical connections
        expect(svg.match(/<path/g)).toHaveLength(3);

        expect(svg).not.toContain('d="M 40 40 L 40 40"');

    });

});
