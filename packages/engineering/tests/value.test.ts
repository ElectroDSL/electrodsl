import { describe, expect, it } from "vitest";
import { parseEngineeringValue } from "../src/index.js";

describe("engineering values", () => {
    it("normalizes SI prefixes", () => {
        expect(parseEngineeringValue("1.5 mm2")).toMatchObject({ dimension: "area", siValue: 0.0000015 });
        expect(parseEngineeringValue("10 kW")).toMatchObject({ dimension: "power", siValue: 10000 });
    });

    it("rejects unknown units", () => {
        expect(parseEngineeringValue("10 bananas")).toBeUndefined();
    });
});
