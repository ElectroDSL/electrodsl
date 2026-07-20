export interface ValidationError {
    code: string;
    message: string;
    severity: "error" | "warning";

    line?: number;
    column?: number;
}