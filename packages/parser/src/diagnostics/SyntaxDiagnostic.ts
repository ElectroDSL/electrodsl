export interface SourceDiagnostic {
    code: "E1000" | "E1001";
    message: string;
    line?: number;
    column?: number;
    offset?: number;
    length?: number;
}

export class ElectroDSLSyntaxError extends SyntaxError {
    constructor(public readonly diagnostics: SourceDiagnostic[]) {
        super(diagnostics.map(diagnostic => {
            const location = diagnostic.line === undefined
                ? ""
                : `Line ${diagnostic.line}, column ${diagnostic.column}: `;
            return `${diagnostic.code} ${location}${diagnostic.message}`;
        }).join("\n"));
        this.name = "ElectroDSLSyntaxError";
    }
}
