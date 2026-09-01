import type { DocumentNode } from "@electrodsl/ast";
import { analyzeConnectivity } from "@electrodsl/analysis";
import { format } from "@electrodsl/formatter";
import { compile } from "@electrodsl/integration";
import { serializeCanonicalIR, toCanonicalIR } from "@electrodsl/ir";
import { parse } from "@electrodsl/parser";
import { generateProductionReport, reportCsvFiles } from "@electrodsl/reports";
import { DuplicateComponentIdRule, ElectricalIntegrityRule, ElectricalReferenceRule, EngineeringSemanticsRule, LanguageVersionRule, NetDefinitionRule, RoutePreferenceRule, Validator } from "@electrodsl/validator";

export const TOOLCHAIN_VERSION = "1.0.0" as const;
export const LANGUAGE_VERSION = "1.0" as const;
export const SUPPORTED_LANGUAGE_VERSIONS = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"] as const;
export type SupportedLanguageVersion = typeof SUPPORTED_LANGUAGE_VERSIONS[number];

export interface SymbolLookup { getSymbol(type: string): { terminals?: Array<{ id: string; name: string }> } | undefined }
export interface CompatibilityResult { compatible: boolean; version: string; stability: "stable" | "legacy" | "unsupported"; message: string }

export function checkLanguageCompatibility(version: string): CompatibilityResult {
    if (version === LANGUAGE_VERSION) return { compatible: true, version, stability: "stable", message: "ElectroDSL 1.0 stable language" };
    if ((SUPPORTED_LANGUAGE_VERSIONS as readonly string[]).includes(version)) return { compatible: true, version, stability: "legacy", message: `ElectroDSL ${version} is supported through the 1.0 compatibility layer` };
    return { compatible: false, version, stability: "unsupported", message: `ElectroDSL ${version} is not supported by toolchain ${TOOLCHAIN_VERSION}` };
}

export function parseDocument(source: string): DocumentNode { return parse(source); }
export function formatSource(source: string): string { return format(source); }
export function compileSvg(source: string, startNodeId?: string): string { return compile(source, startNodeId); }

export function validateDocument(document: DocumentNode, symbols?: SymbolLookup) {
    const rules = [new LanguageVersionRule(), new DuplicateComponentIdRule(), ...(symbols ? [new ElectricalReferenceRule(symbols)] : []), new EngineeringSemanticsRule(), new ElectricalIntegrityRule(), new NetDefinitionRule(), new RoutePreferenceRule()];
    const diagnostics = new Validator(rules).validate(document).errors;
    return { valid: !diagnostics.some(item => item.severity === "error"), errors: diagnostics.filter(item => item.severity === "error"), warnings: diagnostics.filter(item => item.severity === "warning") };
}

export { analyzeConnectivity, generateProductionReport, reportCsvFiles, serializeCanonicalIR, toCanonicalIR };
export type { DocumentNode } from "@electrodsl/ast";
