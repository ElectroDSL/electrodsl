import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

export class NetDefinitionRule implements ValidationRule {
    validate(document: DocumentNode): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const circuit of document.project.circuits) {
            const names = new Set<string>();
            const junctionIds = new Set<string>();

            for (const junction of circuit.junctions ?? []) {
                if (
                    junctionIds.has(junction.id) ||
                    circuit.components.some(component => component.id === junction.id)
                ) {
                    errors.push({
                        code: "E2103",
                        message: `Duplicate component or junction ID: ${junction.id}`,
                        severity: "error"
                    });
                }
                junctionIds.add(junction.id);
            }

            for (const net of circuit.nets ?? []) {
                if (names.has(net.name)) {
                    errors.push({
                        code: "E2101",
                        message: `Duplicate net name: ${net.name}`,
                        severity: "error"
                    });
                }
                if (document.version === "0.2" && net.members.length < 2) {
                    errors.push({
                        code: "E2102",
                        message: `Net '${net.name}' requires at least two members`,
                        severity: "error"
                    });
                }
                const members = new Set<string>();
                for (const member of net.members) {
                    const key = `${member.component}:${member.pin}`;
                    if (members.has(key)) {
                        errors.push({
                            code: "E2104",
                            message: `Duplicate member '${key}' in net '${net.name}'`,
                            severity: "error"
                        });
                    }
                    members.add(key);
                }
                names.add(net.name);
            }
        }

        return errors;
    }
}
