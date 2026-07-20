import type { ValidationError } from "./ValidationError.js";

export interface ValidationResult {
    errors: ValidationError[];
}