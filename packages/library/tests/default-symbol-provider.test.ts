import { describe, expect, it } from "vitest";

import {
    DefaultSymbolProvider,
    type SymbolDefinition
} from "../src";

describe("DefaultSymbolProvider", () => {

    it("registers and retrieves a symbol", () => {

        const provider = new DefaultSymbolProvider();

        const resistor: SymbolDefinition = {

            id: "resistor",

            file: "resistor.svg",

            width: 80,

            height: 20,

            pins: []

        };

        provider.register(resistor);

        expect(
            provider.hasSymbol("resistor")
        ).toBe(true);

        expect(
            provider.getSymbol("resistor")
        ).toEqual(resistor);

        expect(
            provider.listSymbols()
        ).toEqual(["resistor"]);

    });

});