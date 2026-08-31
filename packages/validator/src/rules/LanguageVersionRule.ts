import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

export class LanguageVersionRule implements ValidationRule {
    validate(document: DocumentNode): ValidationError[] {
        if (document.version !== "0.1" && document.version !== "0.2") {
            return [{
                code: "E2000",
                message: `Unsupported ElectroDSL version: ${document.version}`,
                severity: "error"
            }];
        }

        if (document.version === "0.1") {
            const usesV02 = document.project.circuits.some(circuit =>
                (circuit.junctions?.length ?? 0) > 0 ||
                (circuit.nets ?? []).some(net => net.members.length > 0) ||
                circuit.connections.some(connection => connection.route !== undefined)
            );

            if (usesV02) {
                return [{
                    code: "E2005",
                    message: "Nets with members, junctions, and route preferences require EDSL 0.2",
                    severity: "error"
                }];
            }
        }

        return [];
    }
}
