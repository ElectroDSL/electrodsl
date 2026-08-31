import { describe, expect, it } from "vitest";
import { PackageRegistry, validateManifest, type ElectroDSLPackageManifest } from "../src/index.js";

const manifest = (version: string): ElectroDSLPackageManifest => ({
    schema: "electrodsl-package/0.5", name: "@electrodsl/motors", version,
    language: "^0.5", license: "Apache-2.0", components: ["IEC-MOTOR-3PH"]
});

describe("package registry", () => {
    it("validates and resolves the newest compatible package deterministically", () => {
        const registry = new PackageRegistry();
        registry.add(manifest("1.2.0")); registry.add(manifest("1.4.0")); registry.add(manifest("2.0.0"));
        expect(registry.resolve("@electrodsl/motors", "^1.2.0")?.version).toBe("1.4.0");
        expect(registry.resolve("@electrodsl/motors", "^1.4.1")).toBeUndefined();
    });

    it("requires valid names, versions, and licenses", () => {
        expect(validateManifest({ ...manifest("bad"), name: "Bad Name", license: "" })).toHaveLength(3);
    });
});
