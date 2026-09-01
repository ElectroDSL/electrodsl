export interface QualityDiagnostic { code: string; message: string; severity: "error" | "warning"; source?: string; line?: number; column?: number }
export interface QualityResultLike { project: string; valid: boolean; errors: QualityDiagnostic[]; warnings: QualityDiagnostic[] }

export function qualityToSarif(quality: QualityResultLike): string {
    const diagnostics = [...quality.errors, ...quality.warnings];
    const rules = [...new Map(diagnostics.map(item => [item.code, { id: item.code, shortDescription: { text: `ElectroDSL diagnostic ${item.code}` } }])).values()].sort((a, b) => a.id.localeCompare(b.id));
    const results = diagnostics.map(item => ({
        ruleId: item.code,
        level: item.severity === "error" ? "error" : "warning",
        message: { text: item.message },
        ...(item.source ? { locations: [{ physicalLocation: { artifactLocation: { uri: item.source }, ...(item.line ? { region: { startLine: item.line, ...(item.column ? { startColumn: item.column } : {}) } } : {}) } }] } : {})
    }));
    return `${JSON.stringify({ version: "2.1.0", $schema: "https://json.schemastore.org/sarif-2.1.0.json", runs: [{ tool: { driver: { name: "ElectroDSL", semanticVersion: "1.0.0", informationUri: "https://github.com/ElectroDSL/electrodsl", rules } }, automationDetails: { id: quality.project }, results }] }, null, 2)}\n`;
}

export function qualityToJUnit(quality: QualityResultLike): string {
    const diagnostics = [...quality.errors, ...quality.warnings];
    const cases = diagnostics.length === 0
        ? `  <testcase name="project-quality" classname="ElectroDSL"/>`
        : diagnostics.map(item => {
            const name = escapeXml(`${item.code}: ${item.message}`);
            if (item.severity === "error") return `  <testcase name="${name}" classname="ElectroDSL"><failure message="${name}" type="${escapeXml(item.code)}"/></testcase>`;
            return `  <testcase name="${name}" classname="ElectroDSL"><system-out>warning${item.source ? ` in ${escapeXml(item.source)}` : ""}</system-out></testcase>`;
        }).join("\n");
    const tests = Math.max(1, diagnostics.length);
    return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuite name="${escapeXml(quality.project)}" tests="${tests}" failures="${quality.errors.length}" errors="0">\n${cases}\n</testsuite>\n`;
}

const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&apos;");
