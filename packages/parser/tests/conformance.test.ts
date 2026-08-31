import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ElectroDSLSyntaxError, parse } from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../conformance");

describe("ElectroDSL 0.3 conformance", () => {
    for (const file of readdirSync(resolve(root, "accepted"))) {
        it(`accepts ${file}`, () => {
            expect(() => parse(readFileSync(resolve(root, "accepted", file), "utf8"))).not.toThrow();
        });
    }

    for (const file of readdirSync(resolve(root, "rejected"))) {
        it(`rejects ${file} with structured diagnostics`, () => {
            try {
                parse(readFileSync(resolve(root, "rejected", file), "utf8"));
                throw new Error("Expected the fixture to be rejected");
            } catch (error) {
                expect(error).toBeInstanceOf(ElectroDSLSyntaxError);
                expect((error as ElectroDSLSyntaxError).diagnostics[0].code).toMatch(/^E100[01]$/);
            }
        });
    }
});
