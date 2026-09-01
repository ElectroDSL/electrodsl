import type { CircuitNode, DocumentNode, ModuleNode, PropertyNode } from "@electrodsl/ast";
import { parse } from "@electrodsl/parser";

const quote = (value: string) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
const endpoint = (value: { component: string; pin: string }) => value.pin ? `${value.component}.${value.pin}` : value.component;
const properties = (items: PropertyNode[], indent: string) => items.map(item => `${indent}${item.name} = ${quote(item.value)}`);

function printBody(body: CircuitNode, indent: string): string[] {
    const lines: string[] = [];
    for (const port of body.ports ?? []) lines.push("", `${indent}PORT ${port.id};`);
    for (const component of body.components) {
        lines.push("", `${indent}COMPONENT ${component.id} : ${component.componentType} {`);
        lines.push(...properties(component.properties, `${indent}    `), `${indent}}`);
    }
    for (const instance of body.instances ?? []) lines.push("", `${indent}INSTANCE ${instance.id} : ${instance.module};`);
    for (const junction of body.junctions ?? []) lines.push("", `${indent}JUNCTION ${junction.id};`);
    for (const cable of body.cables ?? []) {
        lines.push("", `${indent}CABLE ${cable.id} {`, ...properties(cable.properties, `${indent}    `), `${indent}}`);
    }
    for (const bus of body.buses ?? []) {
        lines.push("", `${indent}BUS ${bus.name} {`, ...properties(bus.properties, `${indent}    `));
        for (const member of bus.members) lines.push(`${indent}    ${endpoint(member)};`);
        lines.push(`${indent}}`);
    }
    for (const net of body.nets ?? []) {
        if (!net.members.length) lines.push("", `${indent}NET ${net.name};`);
        else {
            lines.push("", `${indent}NET ${net.name} {`);
            for (const member of net.members) lines.push(`${indent}    ${endpoint(member)};`);
            lines.push(`${indent}}`);
        }
    }
    for (const conductor of body.conductors ?? []) {
        lines.push("", `${indent}CONDUCTOR ${conductor.id} : ${endpoint(conductor.from)} -> ${endpoint(conductor.to)} {`);
        lines.push(...properties(conductor.properties, `${indent}    `), `${indent}}`);
    }
    for (const connection of body.connections) {
        const head = `${indent}CONNECT ${endpoint(connection.from)} -> ${endpoint(connection.to)}`;
        if (!connection.route) lines.push("", `${head};`);
        else lines.push("", `${head} {`, `${indent}    route = ${quote(connection.route)}`, `${indent}}`);
    }
    return lines;
}

function moduleCircuit(module: ModuleNode): CircuitNode {
    return { ...module.circuit, ports: module.ports };
}

export function printDocument(document: DocumentNode): string {
    const lines: string[] = [`EDSL ${document.version}`, "", `PROJECT ${quote(document.project.name)} {`];
    for (const module of document.project.modules ?? []) {
        lines.push("", `    MODULE ${module.name} {`, ...printBody(moduleCircuit(module), "        "), "", "    }");
    }
    for (const circuit of document.project.circuits) {
        lines.push("", `    CIRCUIT ${quote(circuit.name)} {`, ...printBody(circuit, "        "), "", "    }");
    }
    lines.push("", "}", "");
    return lines.join("\n");
}

export function format(source: string): string { return printDocument(parse(source)); }
