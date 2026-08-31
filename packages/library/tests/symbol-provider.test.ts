import {
    describe,
    expect,
    it
} from "vitest";

import {
    LibrarySymbolProvider
} from "../src/index.js";

import path from "node:path";

describe("SymbolProvider", () => {

    it("loads symbol definition", () => {

        const provider =
            new LibrarySymbolProvider(
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

    it("loads the IEC fuse symbol", () => {

        const provider =
            new LibrarySymbolProvider(
                path.resolve("library")
            );

        const symbol =
            provider.getSymbol("IEC-FUSE");

        expect(symbol?.svg)
            .toContain("<rect");

        expect(symbol?.width)
            .toBe(100);

    });

});
