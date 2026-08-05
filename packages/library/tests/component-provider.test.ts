import { describe, expect, it } from "vitest";

import {
    ComponentRegistry,
    type ComponentDefinition
} from "../src";

describe("ComponentProvider", () => {

    it("retrieves registered components", () => {

        const registry = new ComponentRegistry();

        const resistor: ComponentDefinition = {

            id: "resistor",

            name: "Resistor",

            category: "Passive",

            symbol: {
                file: "resistor.svg",
                width: 80,
                height: 20
            },

            terminals: []

        };

        registry.register(resistor);

        expect(
            registry.has("resistor")
        ).toBe(true);

        expect(
            registry.get("resistor")
        ).toEqual(resistor);

        expect(
            registry.list()
        ).toEqual(["resistor"]);

    });

});