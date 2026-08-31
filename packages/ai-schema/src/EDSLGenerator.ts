import type { AISchematic } from "./AIComponentSchema.js";

const quote = (value: string) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

/** Converts structured AI output into valid, deterministic ElectroDSL 0.5 source. */
export function generateEDSL(schematic: AISchematic): string {
    const lines = ["EDSL 0.5", "", `PROJECT ${quote(schematic.design.name)} {`, "", "    CIRCUIT \"Main\" {"];

    for (const component of schematic.components) {
        lines.push("", `        COMPONENT ${component.id} : ${component.type} {`);
        if (component.description) lines.push(`            description = ${quote(component.description)}`);
        if (component.category) lines.push(`            category = ${quote(component.category)}`);
        lines.push("        }");
    }

    for (const connection of schematic.connections) {
        lines.push("", `        CONNECT ${connection.from} -> ${connection.to};`);
    }

    lines.push("", "    }", "", "}", "");
    return lines.join("\n");
}
