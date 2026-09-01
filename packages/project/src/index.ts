import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeKind, type DocumentNode } from "@electrodsl/ast";
import { analyzeConnectivity } from "@electrodsl/analysis";
import { qualityToJUnit, qualityToSarif } from "@electrodsl/ci";
import { compile } from "@electrodsl/integration";
import { serializeCanonicalIR } from "@electrodsl/ir";
import { LibrarySymbolProvider } from "@electrodsl/library";
import { ProjectLoader } from "@electrodsl/parser";
import { generateProductionReport, reportCsvFiles } from "@electrodsl/reports";
import { DuplicateComponentIdRule, ElectricalIntegrityRule, ElectricalReferenceRule, EngineeringSemanticsRule, LanguageVersionRule, NetDefinitionRule, RoutePreferenceRule, Validator, type ValidationError } from "@electrodsl/validator";

export interface ArtifactEntry { path: string; mediaType: string; sha256: string }
export interface SourceEntry { path: string; sha256: string }
export interface ArtifactManifest { schema: "electrodsl-artifacts/0.9"; project: { name: string; version: string }; sources: SourceEntry[]; artifacts: ArtifactEntry[] }
export interface VerificationResult { valid: boolean; errors: Array<{ code: string; message: string; path?: string }> }
export interface ProjectDiagnostic extends ValidationError { source?: string }
export interface ProjectCheckResult { schema: "electrodsl-quality/0.9"; valid: boolean; project: string; errors: ProjectDiagnostic[]; warnings: ProjectDiagnostic[] }

export class ProjectValidationError extends Error {
    constructor(public readonly result: ProjectCheckResult) { super(`Project quality gate failed with ${result.errors.length} error(s)`); this.name = "ProjectValidationError"; }
}

const portable = (value: string) => value.split(path.sep).join("/");
const digest = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

export function checkProject(projectDirectory: string): ProjectCheckResult {
    return checkLoadedProject(new ProjectLoader().load(path.resolve(projectDirectory)));
}

export function buildProject(projectDirectory: string): ArtifactManifest {
    const root = path.resolve(projectDirectory);
    const loaded = new ProjectLoader().load(root);
    const quality = checkLoadedProject(loaded);
    if (!quality.valid) throw new ProjectValidationError(quality);
    const output = resolveInside(root, loaded.manifest.output?.directory ?? "build");
    mkdirSync(output, { recursive: true });
    const names = loaded.manifest.circuits.map(file => `${path.basename(file, path.extname(file))}.svg`);
    if (new Set(names).size !== names.length) throw new Error("Project circuit output names must be unique");
    const artifacts: ArtifactEntry[] = [];
    const writeArtifact = (relative: string, content: string, mediaType: string): void => {
        const target = resolveInside(output, relative); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, content, "utf8");
        artifacts.push({ path: portable(relative), mediaType, sha256: digest(content) });
    };
    loaded.manifest.circuits.forEach((file, index) => writeArtifact(names[index], compile(readFileSync(resolveInside(root, file), "utf8")), "image/svg+xml"));
    if (loaded.manifest.reports !== false) {
        const document = mergeProject(loaded);
        const report = generateProductionReport(document);
        writeArtifact("reports/report.json", `${JSON.stringify(report, null, 2)}\n`, "application/json");
        for (const [name, content] of Object.entries(reportCsvFiles(report))) writeArtifact(`reports/${name}`, content, "text/csv");
        writeArtifact("connectivity.json", `${JSON.stringify(analyzeConnectivity(document), null, 2)}\n`, "application/json");
    }
    writeArtifact("quality.json", `${JSON.stringify(quality, null, 2)}\n`, "application/json");
    writeArtifact("quality.sarif", qualityToSarif(quality), "application/sarif+json");
    writeArtifact("quality.junit.xml", qualityToJUnit(quality), "application/xml");
    writeArtifact("project.json", serializeCanonicalIR(mergeProject(loaded)), "application/json");
    const manifest: ArtifactManifest = { schema: "electrodsl-artifacts/0.9", project: { name: loaded.manifest.name, version: loaded.manifest.version },
        sources: loaded.manifest.circuits.map(file => ({ path: portable(file), sha256: digest(readFileSync(resolveInside(root, file))) })).sort(byPath), artifacts: artifacts.sort(byPath) };
    writeFileSync(path.join(output, "artifacts.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    return manifest;
}

export function verifyProjectBuild(projectDirectory: string): VerificationResult {
    const root = path.resolve(projectDirectory); const loaded = new ProjectLoader().load(root); const output = resolveInside(root, loaded.manifest.output?.directory ?? "build");
    const manifestPath = path.join(output, "artifacts.json"); const errors: VerificationResult["errors"] = [];
    if (!existsSync(manifestPath)) return { valid: false, errors: [{ code: "B3000", message: "Artifact manifest is missing", path: portable(path.relative(root, manifestPath)) }] };
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as ArtifactManifest;
    if (manifest.schema !== "electrodsl-artifacts/0.9" || manifest.project.name !== loaded.manifest.name || manifest.project.version !== loaded.manifest.version) errors.push({ code: "B3004", message: "Artifact manifest does not describe this project", path: portable(path.relative(root, manifestPath)) });
    const expectedSources = [...loaded.manifest.circuits].map(portable).sort();
    if (JSON.stringify(expectedSources) !== JSON.stringify(manifest.sources.map(item => item.path).sort())) errors.push({ code: "B3004", message: "Artifact manifest source list does not match the project", path: portable(path.relative(root, manifestPath)) });
    for (const entry of manifest.sources) checkDigest(root, entry, errors); for (const entry of manifest.artifacts) checkDigest(output, entry, errors);
    return { valid: errors.length === 0, errors };
}

function checkLoadedProject(loaded: ReturnType<ProjectLoader["load"]>): ProjectCheckResult {
    const diagnostics: ProjectDiagnostic[] = [];
    loaded.documents.forEach((document, index) => { const source = portable(loaded.manifest.circuits[index]);
        if (document.project.name !== loaded.manifest.name) diagnostics.push({ code: "P4001", message: `Source project '${document.project.name}' does not match manifest project '${loaded.manifest.name}'`, severity: "error", source });
        if (document.version !== (loaded.manifest.language ?? "0.9")) diagnostics.push({ code: "P4002", message: `Source language ${document.version} does not match project language ${loaded.manifest.language ?? "0.9"}`, severity: "error", source });
    });
    const merged = mergeProject(loaded); const libraryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../library/library");
    diagnostics.push(...new Validator([new LanguageVersionRule(), new DuplicateComponentIdRule(), new ElectricalReferenceRule(new LibrarySymbolProvider(libraryRoot)), new EngineeringSemanticsRule(), new ElectricalIntegrityRule(), new NetDefinitionRule(), new RoutePreferenceRule()]).validate(merged).errors);
    addDuplicateNames("circuit", merged.project.circuits.map(item => item.name), diagnostics); addDuplicateNames("module", (merged.project.modules ?? []).map(item => item.name), diagnostics);
    const errors = diagnostics.filter(item => item.severity === "error");
    return { schema: "electrodsl-quality/0.9", valid: errors.length === 0, project: loaded.manifest.name, errors, warnings: diagnostics.filter(item => item.severity === "warning") };
}

function mergeProject(loaded: ReturnType<ProjectLoader["load"]>): DocumentNode { return { kind: NodeKind.Document, version: loaded.manifest.language ?? "0.9", project: { kind: NodeKind.Project, name: loaded.manifest.name, version: loaded.manifest.version, circuits: loaded.documents.flatMap(item => item.project.circuits), modules: loaded.documents.flatMap(item => item.project.modules ?? []), sourceFiles: loaded.manifest.circuits } }; }
function addDuplicateNames(kind: string, names: string[], diagnostics: ProjectDiagnostic[]): void { const seen = new Set<string>(); for (const name of names) if (seen.has(name)) diagnostics.push({ code: "P4003", message: `Duplicate project-wide ${kind} name '${name}'`, severity: "error" }); else seen.add(name); }
function checkDigest(base: string, entry: { path: string; sha256: string }, errors: VerificationResult["errors"]): void { let target: string; try { target = resolveInside(base, entry.path); } catch { errors.push({ code: "B3003", message: "Manifest path escapes its directory", path: entry.path }); return; } if (!existsSync(target)) { errors.push({ code: "B3001", message: "Expected file is missing", path: entry.path }); return; } if (digest(readFileSync(target)) !== entry.sha256) errors.push({ code: "B3002", message: "File digest does not match the build manifest", path: entry.path }); }
function resolveInside(root: string, requested: string): string { const target = path.resolve(root, requested); const relative = path.relative(root, target); if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Path escapes its directory: '${requested}'`); return target; }
const byPath = (a: { path: string }, b: { path: string }) => a.path.localeCompare(b.path);
