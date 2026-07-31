import {
    describe,
    expect,
    it
} from "vitest";

import {
    SymbolProvider
} from "../src/index.js";

import path from "node:path";

describe("SymbolProvider", () => {

    it("loads symbol definition", () => {

        const provider =
            new SymbolProvider(
                path.resolve("library")
            );

        const symbol =
            provider.getSymbol(
                "IEC-MOTOR-3PH"
            );

        expect(symbol).toBeDefined();

        expect(symbol?.svg)
            .toContain("<svg");

        expect(symbol?.width)
            .toBe(100);

    });

});