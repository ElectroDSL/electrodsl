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

    it("rejects missing packages and dependency cycles", () => {
        const missing = new PackageRegistry();
        expect(() => missing.createLockfile({ "@electrodsl/missing": "^1.0.0" })).toThrow("Unable to resolve");

        const cyclic = new PackageRegistry();
        cyclic.add({ ...manifest("1.0.0"), dependencies: { "@electrodsl/core": "^1.0.0" } });
        cyclic.add({ ...manifest("1.0.0"), name: "@electrodsl/core", dependencies: { "@electrodsl/motors": "^1.0.0" } });
        expect(() => cyclic.createLockfile({ "@electrodsl/motors": "^1.0.0" })).toThrow("Dependency cycle");
    });

    it("creates and verifies deterministic transitive lockfiles", () => {
        const registry = new PackageRegistry();
        registry.add({ ...manifest("1.0.0"), dependencies: { "@electrodsl/core": "^1.0.0" } });
        registry.add({ ...manifest("1.1.0"), name: "@electrodsl/core", components: ["IEC-FUSE"] });
        const lock = registry.createLockfile({ "@electrodsl/motors": "^1.0.0" });
        expect(Object.keys(lock.packages)).toEqual(["@electrodsl/core", "@electrodsl/motors"]);
        expect(lock.packages["@electrodsl/core"].integrity).toMatch(/^sha256-/);
        expect(registry.verifyLockfile(lock)).toEqual([]);
        lock.packages["@electrodsl/core"].integrity = "sha256-tampered";
        expect(registry.verifyLockfile(lock)[0].code).toBe("P2002");
    });

    it("requires valid names, versions, and licenses", () => {
        expect(validateManifest({ ...manifest("bad"), name: "Bad Name", license: "" })).toHaveLength(3);
    });
});
