import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";

export interface ValidationRule {

    validate(
        document: DocumentNode
    ): ValidationError[];

}