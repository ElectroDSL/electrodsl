import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NodeKind, type DocumentNode } from "@electrodsl/ast";
import { compile } from "@electrodsl/integration";
import { ProjectLoader } from "@electrodsl/parser";
import { generateProductionReport, reportCsvFiles } from "@electrodsl/reports";

export interface ArtifactEntry { path: string; mediaType: string; sha256: string }
export interface SourceEntry { path: string; sha256: string }
export interface ArtifactManifest {
    schema: "electrodsl-artifacts/0.6";
    project: { name: string; version: string };
    sources: SourceEntry[];
    artifacts: ArtifactEntry[];
}
export interface VerificationResult { valid: boolean; errors: Array<{ code: string; message: string; path?: string }> }

const portable = (value: string) => value.split(path.sep).join("/");
const digest = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

export function buildProject(projectDirectory: string): ArtifactManifest {
    const root = path.resolve(projectDirectory);
    const loaded = new ProjectLoader().load(root);
    const outputName = loaded.manifest.output?.directory ?? "build";
    const output = resolveInside(root, outputName);
    const reports = path.join(output, "reports");
    mkdirSync(reports, { recursive: true });

    const names = loaded.manifest.circuits.map(file => `${path.basename(file, path.extname(file))}.svg`);
    if (new Set(names).size !== names.length) throw new Error("Project circuit output names must be unique");

    const artifacts: ArtifactEntry[] = [];
    const writeArtifact = (relative: string, content: string, mediaType: string): void => {
        const target = resolveInside(output, relative);
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, content, "utf8");
        artifacts.push({ path: portable(relative), mediaType, sha256: digest(content) });
    };

    loaded.manifest.circuits.forEach((file, index) => {
        const source = readFileSync(resolveInside(root, file), "utf8");
        writeArtifact(names[index], compile(source), "image/svg+xml");
    });

    if (loaded.manifest.reports !== false) {
        const document: DocumentNode = {
            kind: NodeKind.Document,
            version: loaded.manifest.language ?? "0.6",
            project: {
                kind: NodeKind.Project,
                name: loaded.manifest.name,
                version: loaded.manifest.version,
                circuits: loaded.documents.flatMap(item => item.project.circuits),
                modules: loaded.documents.flatMap(item => item.project.modules ?? []),
                sourceFiles: loaded.manifest.circuits
            }
        };
        const report = generateProductionReport(document);
        writeArtifact("reports/report.json", `${JSON.stringify(report, null, 2)}\n`, "application/json");
        for (const [name, content] of Object.entries(reportCsvFiles(report))) writeArtifact(`reports/${name}`, content, "text/csv");
    }

    const manifest: ArtifactManifest = {
        schema: "electrodsl-artifacts/0.6",
        project: { name: loaded.manifest.name, version: loaded.manifest.version },
        sources: loaded.manifest.circuits.map(file => ({ path: portable(file), sha256: digest(readFileSync(resolveInside(root, file))) })).sort(byPath),
        artifacts: artifacts.sort(byPath)
    };
    writeFileSync(path.join(output, "artifacts.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    return manifest;
}

export function verifyProjectBuild(projectDirectory: string): VerificationResult {
    const root = path.resolve(projectDirectory);
    const loaded = new ProjectLoader().load(root);
    const output = resolveInside(root, loaded.manifest.output?.directory ?? "build");
    const manifestPath = path.join(output, "artifacts.json");
    const errors: VerificationResult["errors"] = [];
    if (!existsSync(manifestPath)) return { valid: false, errors: [{ code: "B3000", message: "Artifact manifest is missing", path: portable(path.relative(root, manifestPath)) }] };
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as ArtifactManifest;
    if (manifest.schema !== "electrodsl-artifacts/0.6" || manifest.project.name !== loaded.manifest.name || manifest.project.version !== loaded.manifest.version) {
        errors.push({ code: "B3004", message: "Artifact manifest does not describe this project", path: portable(path.relative(root, manifestPath)) });
    }
    const expectedSources = [...loaded.manifest.circuits].map(portable).sort();
    const recordedSources = manifest.sources.map(item => item.path).sort();
    if (JSON.stringify(expectedSources) !== JSON.stringify(recordedSources)) errors.push({ code: "B3004", message: "Artifact manifest source list does not match the project", path: portable(path.relative(root, manifestPath)) });
    for (const entry of manifest.sources) checkDigest(root, entry, errors);
    for (const entry of manifest.artifacts) checkDigest(output, entry, errors);
    return { valid: errors.length === 0, errors };
}

function checkDigest(base: string, entry: { path: string; sha256: string }, errors: VerificationResult["errors"]): void {
    let target: string;
    try { target = resolveInside(base, entry.path); }
    catch { errors.push({ code: "B3003", message: "Manifest path escapes its directory", path: entry.path }); return; }
    if (!existsSync(target)) { errors.push({ code: "B3001", message: "Expected file is missing", path: entry.path }); return; }
    if (digest(readFileSync(target)) !== entry.sha256) errors.push({ code: "B3002", message: "File digest does not match the build manifest", path: entry.path });
}

function resolveInside(root: string, requested: string): string {
    const target = path.resolve(root, requested);
    const relative = path.relative(root, target);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Path escapes its directory: '${requested}'`);
    return target;
}
const byPath = (a: { path: string }, b: { path: string }) => a.path.localeCompare(b.path);
