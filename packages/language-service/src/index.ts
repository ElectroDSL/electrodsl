import { format } from "@electrodsl/formatter";
import { ElectroDSLSyntaxError, parse } from "@electrodsl/parser";
import {
    DuplicateComponentIdRule, ElectricalIntegrityRule, ElectricalReferenceRule, EngineeringSemanticsRule,
    LanguageVersionRule, NetDefinitionRule, RoutePreferenceRule, Validator
} from "@electrodsl/validator";

export interface EditorDiagnostic {
    code: string;
    message: string;
    severity: "error" | "warning";
    range?: { start: { line: number; character: number }; end: { line: number; character: number } };
}
export interface CompletionItem { label: string; detail: string; insertText?: string }
export interface HoverInfo { title: string; documentation: string }
export interface SymbolLookup { getSymbol(type: string): { terminals?: Array<{ id: string; name: string }> } | undefined }

const keywords: CompletionItem[] = [
    ["PROJECT", "Declare a schematic project"], ["MODULE", "Declare a reusable circuit module"],
    ["CIRCUIT", "Declare a schematic sheet"], ["COMPONENT", "Place a library component"],
    ["INSTANCE", "Instantiate a reusable module"], ["PORT", "Declare a module or cross-sheet port"],
    ["CONNECT", "Declare electrical continuity"], ["NET", "Declare a named electrical net"],
    ["CONDUCTOR", "Declare an engineered conductor"], ["CABLE", "Declare a physical cable"],
    ["BUS", "Declare a multi-member electrical bus"], ["JUNCTION", "Declare an explicit junction"]
].map(([label, detail]) => ({ label, detail }));

const hover = new Map(keywords.map(item => [item.label, { title: item.label, documentation: item.detail }]));

export class ElectroDSLLanguageService {
    constructor(private readonly symbols?: SymbolLookup) {}

    diagnose(source: string): EditorDiagnostic[] {
        try {
            const document = parse(source);
            const rules = [
                new LanguageVersionRule(), new DuplicateComponentIdRule(),
                new EngineeringSemanticsRule(), new ElectricalIntegrityRule(), new NetDefinitionRule(), new RoutePreferenceRule()
            ];
            const validator = this.symbols
                ? new Validator([...rules, new ElectricalReferenceRule(this.symbols)])
                : new Validator(rules);
            return validator.validate(document).errors.map(error => ({ ...error }));
        } catch (error) {
            if (!(error instanceof ElectroDSLSyntaxError)) throw error;
            return error.diagnostics.map(item => ({
                code: item.code, message: item.message, severity: "error",
                range: item.line === undefined ? undefined : {
                    start: { line: item.line - 1, character: (item.column ?? 1) - 1 },
                    end: { line: item.line - 1, character: (item.column ?? 1) - 1 + Math.max(item.length ?? 1, 1) }
                }
            }));
        }
    }

    format(source: string): string { return format(source); }
    complete(prefix = ""): CompletionItem[] {
        const normalized = prefix.toUpperCase();
        return keywords.filter(item => item.label.startsWith(normalized));
    }
    hover(word: string): HoverInfo | undefined { return hover.get(word.toUpperCase()); }
}
