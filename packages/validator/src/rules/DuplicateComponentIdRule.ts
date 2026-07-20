import type { DocumentNode } from "@electrodsl/ast";

import type { ValidationRule } from "./ValidationRule.js";
import type { ValidationError } from "../ValidationError.js";


export class DuplicateComponentIdRule
    implements ValidationRule {


    validate(
        document: DocumentNode
    ): ValidationError[] {

        const errors: ValidationError[] = [];


        for (const circuit of document.project.circuits) {

            const ids = new Set<string>();


            for (const component of circuit.components) {

                if (ids.has(component.id)) {

                    errors.push({

                        code: "E1001",

                        message:
                            `Duplicate component ID: ${component.id}`,

                        severity: "error"

                    });

                }


                ids.add(component.id);

            }

        }


        return errors;

    }

}