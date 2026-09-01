import type { CircuitNode, DocumentNode } from "@electrodsl/ast";
import { serializeCanonicalIR } from "@electrodsl/ir";

export interface ElectroDSLAdapter {
    id: string;
    label: string;
    extensions: string[];
    export(document: DocumentNode): string;
    import?(source: string): string;
}

export class AdapterRegistry {
    private readonly adapters = new Map<string, ElectroDSLAdapter>();
    register(adapter: ElectroDSLAdapter): void {
        if (this.adapters.has(adapter.id)) throw new Error(`Adapter '${adapter.id}' is already registered`);
        this.adapters.set(adapter.id, adapter);
    }
    get(id: string): ElectroDSLAdapter | undefined { return this.adapters.get(id); }
    list(): Array<{ id: string; label: string; extensions: string[]; canImport: boolean }> {
        return [...this.adapters.values()].map(({ id, label, extensions, import: importer }) => ({ id, label, extensions, canImport: !!importer }));
    }
}

export const canonicalJsonAdapter: ElectroDSLAdapter = {
    id: "canonical-json", label: "ElectroDSL Canonical JSON", extensions: [".json"],
    export: serializeCanonicalIR
};

const csv = (value: string) => /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
const endpoint = (value: { component: string; pin: string }) => value.pin ? `${value.component}.${value.pin}` : value.component;

export const netlistCsvAdapter: ElectroDSLAdapter = {
    id: "netlist-csv", label: "ElectroDSL CSV Netlist", extensions: [".csv"],
    export(document) {
        const rows = [["circuit", "kind", "id", "type", "from", "to", "properties"]];
        for (const module of document.project.modules ?? []) appendRows(rows, `@module:${module.name}`, { ...module.circuit, ports: module.ports });
        for (const circuit of document.project.circuits) appendRows(rows, circuit.name, circuit);
        return `${rows.map(row => row.map(csv).join(",")).join("\n")}\n`;
    },
    import(source) {
        const records = parseCsv(source);
        const header = records.shift();
        if (!header || header.join(",") !== "circuit,kind,id,type,from,to,properties") throw new Error("Unsupported CSV netlist header");
        const circuits = new Map<string, string[][]>();
        for (const record of records) {
            if (record.length !== 7) throw new Error("CSV netlist rows require seven columns");
            const items = circuits.get(record[0]) ?? []; items.push(record); circuits.set(record[0], items);
        }
        const lines = ["EDSL 0.5", "", 'PROJECT "Imported Netlist" {'];
        const ordered = [...circuits].sort(([a], [b]) => Number(b.startsWith("@module:")) - Number(a.startsWith("@module:")));
        for (const [name, items] of ordered) {
            const moduleName = name.startsWith("@module:") ? name.slice("@module:".length) : undefined;
            lines.push("", moduleName ? `    MODULE ${moduleName} {` : `    CIRCUIT ${JSON.stringify(name)} {`);
            for (const [, kind, id, type, from, to, propertyJson] of items) {
                const values = JSON.parse(propertyJson || "{}");
                if (kind === "component") {
                    lines.push("", `        COMPONENT ${id} : ${type} {`);
                    appendProperties(lines, values);
                    lines.push("        }");
                } else if (kind === "connection") lines.push("", `        CONNECT ${from} -> ${to};`);
                else if (kind === "conductor") {
                    lines.push("", `        CONDUCTOR ${id} : ${from} -> ${to} {`);
                    appendProperties(lines, values);
                    lines.push("        }");
                } else if (kind === "port") lines.push("", `        PORT ${id};`);
                else if (kind === "junction") lines.push("", `        JUNCTION ${id};`);
                else if (kind === "instance") lines.push("", `        INSTANCE ${id} : ${type};`);
                else if (kind === "cable") {
                    lines.push("", `        CABLE ${id} {`); appendProperties(lines, values); lines.push("        }");
                } else if (kind === "net" || kind === "bus") {
                    lines.push("", `        ${kind === "net" ? "NET" : "BUS"} ${id} {`);
                    const members = Array.isArray(values.__members) ? values.__members : [];
                    delete values.__members; appendProperties(lines, values);
                    for (const member of members) lines.push(`            ${member};`);
                    lines.push("        }");
                }
            }
            lines.push("", "    }");
        }
        lines.push("", "}", "");
        return lines.join("\n");
    }
};

function propertyRecord(properties: Array<{ name: string; value: string }>): Record<string, string> {
    return Object.fromEntries(properties.map(property => [property.name, property.value]));
}

function appendRows(rows: string[][], name: string, circuit: CircuitNode): void {
    for (const port of circuit.ports ?? []) rows.push([name, "port", port.id, "port", "", "", "{}"]) ;
    for (const junction of circuit.junctions ?? []) rows.push([name, "junction", junction.id, "junction", "", "", "{}"]) ;
    for (const component of circuit.components) rows.push([name, "component", component.id, component.componentType, "", "", JSON.stringify(propertyRecord(component.properties))]);
    for (const instance of circuit.instances ?? []) rows.push([name, "instance", instance.id, instance.module, "", "", "{}"]) ;
    for (const cable of circuit.cables ?? []) rows.push([name, "cable", cable.id, "cable", "", "", JSON.stringify(propertyRecord(cable.properties))]);
    circuit.connections.forEach((connection, index) => rows.push([
        name, "connection", `C${index + 1}`, "wire", endpoint(connection.from), endpoint(connection.to), JSON.stringify(connection.route ? { route: connection.route } : {})
    ]));
    for (const conductor of circuit.conductors ?? []) rows.push([
        name, "conductor", conductor.id, "conductor", endpoint(conductor.from), endpoint(conductor.to), JSON.stringify(propertyRecord(conductor.properties))
    ]);
    for (const net of circuit.nets ?? []) rows.push([name, "net", net.name, "net", "", "", JSON.stringify({ __members: net.members.map(endpoint) })]);
    for (const bus of circuit.buses ?? []) rows.push([name, "bus", bus.name, "bus", "", "", JSON.stringify({ ...propertyRecord(bus.properties), __members: bus.members.map(endpoint) })]);
}

function appendProperties(lines: string[], values: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(values)) lines.push(`            ${key} = ${JSON.stringify(String(value))}`);
}

export function createDefaultAdapterRegistry(): AdapterRegistry {
    const registry = new AdapterRegistry();
    registry.register(canonicalJsonAdapter); registry.register(netlistCsvAdapter);
    return registry;
}

function parseCsv(source: string): string[][] {
    const rows: string[][] = []; let row: string[] = []; let field = ""; let quoted = false;
    for (let index = 0; index < source.length; index++) {
        const char = source[index];
        if (quoted && char === '"' && source[index + 1] === '"') { field += '"'; index++; }
        else if (char === '"') quoted = !quoted;
        else if (!quoted && char === ",") { row.push(field); field = ""; }
        else if (!quoted && (char === "\n" || char === "\r")) {
            if (char === "\r" && source[index + 1] === "\n") index++;
            row.push(field); if (row.some(value => value.length)) rows.push(row); row = []; field = "";
        } else field += char;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    if (quoted) throw new Error("Unterminated quoted CSV field");
    return rows;
}
