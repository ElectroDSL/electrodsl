import { ElectroDSLLanguageService, type EditorDiagnostic, type SymbolLookup } from "@electrodsl/language-service";
import { parse } from "@electrodsl/parser";
import type { DocumentNode } from "@electrodsl/ast";

export interface DesignExplanation {
    project: string;
    summary: string;
    circuits: Array<{ name: string; components: number; connections: number; nets: string[]; engineering: string[] }>;
    disclaimer: string;
}
export interface OptimizationSuggestion { code: string; severity: "information" | "warning"; message: string }
export interface AIReview {
    valid: boolean;
    diagnostics: EditorDiagnostic[];
    explanation?: DesignExplanation;
    suggestions: OptimizationSuggestion[];
}

export function buildGenerationPrompt(requirement: string, componentTypes: string[] = []): string {
    return [
        "Generate one ElectroDSL 0.5 document and no Markdown fences.",
        "Use only declared component types and valid terminal names. Use typed values such as \"10 A\", \"230 V\", and \"1.5 mm2\".",
        "Use CONDUCTOR for engineered wiring, PORT for cross-sheet continuity, and PE for protective earth where the design requires it.",
        componentTypes.length ? `Allowed component types: ${componentTypes.join(", ")}.` : "Do not invent component types; mark unresolved choices in a description property.",
        `Requirement: ${requirement}`,
        "The output must still be reviewed by a qualified electrical engineer before construction."
    ].join("\n");
}

export function explainDesign(source: string): DesignExplanation {
    const document = parse(source) as DocumentNode;
    const circuits = document.project.circuits.map(circuit => ({
        name: circuit.name,
        components: circuit.components.length + (circuit.instances?.length ?? 0),
        connections: circuit.connections.length + (circuit.conductors?.length ?? 0),
        nets: [...(circuit.nets ?? []).map(net => net.name), ...(circuit.buses ?? []).map(bus => bus.name)],
        engineering: [
            ...(circuit.conductors ?? []).map(item => `conductor ${item.id}`),
            ...(circuit.cables ?? []).map(item => `cable ${item.id}`),
            ...(circuit.buses ?? []).map(item => `bus ${item.name}`)
        ]
    }));
    return {
        project: document.project.name,
        summary: `${circuits.length} circuit(s), ${document.project.modules?.length ?? 0} reusable module(s), and ${circuits.reduce((sum, item) => sum + item.components, 0)} placed component(s).`,
        circuits,
        disclaimer: "This structural explanation is not a certification of electrical safety or regulatory compliance."
    };
}

export function suggestOptimizations(source: string): OptimizationSuggestion[] {
    const document = parse(source) as DocumentNode; const suggestions: OptimizationSuggestion[] = [];
    for (const circuit of document.project.circuits) {
        const used = new Set([
            ...circuit.connections.flatMap(item => [item.from.component, item.to.component]),
            ...(circuit.conductors ?? []).flatMap(item => [item.from.component, item.to.component]),
            ...(circuit.nets ?? []).flatMap(item => item.members.map(member => member.component)),
            ...(circuit.buses ?? []).flatMap(item => item.members.map(member => member.component))
        ]);
        for (const component of circuit.components) if (!used.has(component.id)) suggestions.push({
            code: "AI3001", severity: "warning", message: `Component '${component.id}' in '${circuit.name}' is electrically unconnected.`
        });
        for (const conductor of circuit.conductors ?? []) {
            const names = new Set(conductor.properties.map(property => property.name));
            if (!names.has("size")) suggestions.push({ code: "AI3002", severity: "warning", message: `Conductor '${conductor.id}' has no cross-sectional size.` });
            if (!names.has("phase")) suggestions.push({ code: "AI3003", severity: "information", message: `Conductor '${conductor.id}' has no phase designation.` });
        }
    }
    if (!suggestions.length) suggestions.push({ code: "AI3000", severity: "information", message: "No structural optimization hints were found; engineering review is still required." });
    return suggestions;
}

export function reviewDesign(source: string, symbols?: SymbolLookup): AIReview {
    const diagnostics = new ElectroDSLLanguageService(symbols).diagnose(source);
    if (diagnostics.some(item => item.severity === "error")) return { valid: false, diagnostics, suggestions: [] };
    return { valid: true, diagnostics, explanation: explainDesign(source), suggestions: suggestOptimizations(source) };
}
