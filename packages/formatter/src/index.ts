import type { DocumentNode } from "@electrodsl/ast";
import { parse } from "@electrodsl/parser";

const quote = (value: string) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
const endpoint = (value: { component: string; pin: string }) =>
    value.pin ? `${value.component}.${value.pin}` : value.component;

export function printDocument(document: DocumentNode): string {
    const lines: string[] = [`EDSL ${document.version}`, "", `PROJECT ${quote(document.project.name)} {`];

    document.project.circuits.forEach((circuit, circuitIndex) => {
        lines.push("", `    CIRCUIT ${quote(circuit.name)} {`);

        for (const component of circuit.components) {
            lines.push("", `        COMPONENT ${component.id} : ${component.componentType} {`);
            for (const property of component.properties) {
                lines.push(`            ${property.name} = ${quote(property.value)}`);
            }
            lines.push("        }");
        }

        for (const junction of circuit.junctions ?? []) {
            lines.push("", `        JUNCTION ${junction.id};`);
        }

        for (const net of circuit.nets ?? []) {
            if (net.members.length === 0) {
                lines.push("", `        NET ${net.name};`);
                continue;
            }
            lines.push("", `        NET ${net.name} {`);
            for (const member of net.members) lines.push(`            ${endpoint(member)};`);
            lines.push("        }");
        }

        for (const connection of circuit.connections) {
            const head = `        CONNECT ${endpoint(connection.from)} -> ${endpoint(connection.to)}`;
            if (!connection.route) {
                lines.push("", `${head};`);
            } else {
                lines.push("", `${head} {`, `            route = ${quote(connection.route)}`, "        }");
            }
        }

        lines.push("", "    }");
        if (circuitIndex < document.project.circuits.length - 1) lines.push("");
    });

    lines.push("", "}", "");
    return lines.join("\n");
}

export function format(source: string): string {
    return printDocument(parse(source));
}
