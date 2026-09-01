import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildProject, checkProject, ProjectValidationError, verifyProjectBuild } from "../src/index.js";

const roots: string[] = [];
const source = (name: string) => `EDSL 0.6\nPROJECT "Demo" {\n CIRCUIT "${name}" {\n  COMPONENT R1 : IEC-RESISTOR { resistance = "1 kohm" }\n }\n}\n`;

afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe("production project builds", () => {
    it("builds deterministic artifacts and detects tampering", () => {
        const root = mkdtempSync(join(tmpdir(), "electrodsl-project-")); roots.push(root);
        writeFileSync(join(root, "electrodsl.json"), JSON.stringify({ schema: "electrodsl-project/0.6", name: "Demo", version: "1.0.0", language: "0.6", circuits: ["main.edsl", "control.edsl"], output: { directory: "build", format: "svg" }, reports: true }));
        writeFileSync(join(root, "main.edsl"), source("Main"));
        writeFileSync(join(root, "control.edsl"), source("Control"));
        const manifest = buildProject(root);
        expect(manifest.schema).toBe("electrodsl-artifacts/0.7");
        expect(manifest.artifacts.map(item => item.path)).toContain("quality.json");
        expect(manifest.artifacts.map(item => item.path)).toContain("reports/bom.csv");
        expect(verifyProjectBuild(root)).toEqual({ valid: true, errors: [] });
        expect(buildProject(root)).toEqual(manifest);
        writeFileSync(join(root, "build", "main.svg"), `${readFileSync(join(root, "build", "main.svg"), "utf8")}tampered`);
        expect(verifyProjectBuild(root).errors[0]).toMatchObject({ code: "B3002", path: "main.svg" });
    });

    it("blocks generation when project-wide quality checks fail", () => {
        const root = mkdtempSync(join(tmpdir(), "electrodsl-project-")); roots.push(root);
        writeFileSync(join(root, "electrodsl.json"), JSON.stringify({ schema: "electrodsl-project/0.7", name: "Demo", version: "1.0.0", language: "0.7", circuits: ["main.edsl"] }));
        writeFileSync(join(root, "main.edsl"), source("Main").replace("EDSL 0.6", "EDSL 0.7").replace('PROJECT "Demo"', 'PROJECT "Wrong"'));
        expect(checkProject(root).errors).toContainEqual(expect.objectContaining({ code: "P4001", source: "main.edsl" }));
        expect(() => buildProject(root)).toThrow(ProjectValidationError);
    });

    it("rejects output paths outside the project", () => {
        const root = mkdtempSync(join(tmpdir(), "electrodsl-project-")); roots.push(root);
        writeFileSync(join(root, "electrodsl.json"), JSON.stringify({ name: "Demo", version: "1.0.0", language: "0.6", circuits: ["main.edsl"], output: { directory: "../outside", format: "svg" } }));
        writeFileSync(join(root, "main.edsl"), source("Main"));
        expect(() => buildProject(root)).toThrow(/escapes/);
    });
});
