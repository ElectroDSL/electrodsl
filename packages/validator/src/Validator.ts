import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationResult } from "./ValidationResult.js";
import type { ValidationRule } from "./rules/ValidationRule.js";


export class Validator {

    constructor(
        private rules: ValidationRule[] = []
    ) {}


    validate(
        document: DocumentNode
    ): ValidationResult {

        const errors = this.rules.flatMap(
            rule => rule.validate(document)
        );

        return {
            errors
        };

    }

}