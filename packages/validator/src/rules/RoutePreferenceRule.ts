import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

export class RoutePreferenceRule implements ValidationRule {
    validate(document: DocumentNode): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const circuit of document.project.circuits) {
            for (const connection of circuit.connections) {
                if (
                    connection.route !== undefined &&
                    connection.route !== "auto" &&
                    connection.route !== "above" &&
                    connection.route !== "below"
                ) {
                    errors.push({
                        code: "E2201",
                        message: `Unsupported route preference '${connection.route}'`,
                        severity: "error"
                    });
                }
            }
        }

        return errors;
    }
}
