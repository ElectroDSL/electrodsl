import type { CircuitNode, DocumentNode, PropertyNode } from "@electrodsl/ast";

export interface BomRow { type: string; quantity: number; references: string[]; description?: string; properties: Record<string, string> }
export interface ConductorRow { circuit: string; id: string; from: string; to: string; size?: string; phase?: string; cable?: string; length?: string }
export interface CableRow { circuit: string; id: string; cores?: string; size?: string; length?: string; conductors: string[] }
export interface TerminalRow { circuit: string; endpoint: string; connectedTo: string; kind: "connection" | "conductor" | "net" | "bus" }
export interface CrossReferenceRow { name: string; kind: "port" | "module"; locations: string[] }
export interface ProductionReport {
    schema: "electrodsl-report/0.6";
    project: string;
    bom: BomRow[];
    conductors: ConductorRow[];
    cables: CableRow[];
    terminals: TerminalRow[];
    crossReferences: CrossReferenceRow[];
}

interface Scope { circuit: string; prefix: string; body: CircuitNode }
const props = (items: PropertyNode[]) => Object.fromEntries(items.map(item => [item.name, item.value]));
const stableProperties = (value: Record<string, string>) => Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
const localEndpoint = (value: { component: string; pin: string }) => value.pin ? `${value.component}.${value.pin}` : value.component;
const scoped = (prefix: string, value: string) => prefix ? `${prefix}/${value}` : value;

export function generateProductionReport(document: DocumentNode): ProductionReport {
    const modules = new Map((document.project.modules ?? []).map(module => [module.name, module]));
    const scopes: Scope[] = [];
    const walk = (body: CircuitNode, circuit: string, prefix = "", stack = new Set<string>()): void => {
        scopes.push({ body, circuit, prefix });
        for (const instance of body.instances ?? []) {
            const module = modules.get(instance.module);
            if (!module || stack.has(instance.module)) continue;
            walk(module.circuit, circuit, scoped(prefix, instance.id), new Set([...stack, instance.module]));
        }
    };
    for (const circuit of document.project.circuits) walk(circuit, circuit.name);

    const bomGroups = new Map<string, BomRow>();
    const conductors: ConductorRow[] = [];
    const cables: CableRow[] = [];
    const terminals: TerminalRow[] = [];
    const portLocations = new Map<string, Set<string>>();
    const moduleLocations = new Map<string, Set<string>>();

    for (const { body, circuit, prefix } of scopes) {
        for (const component of body.components) {
            const properties = props(component.properties);
            const key = JSON.stringify([component.componentType, stableProperties(properties)]);
            const reference = scoped(prefix, component.id);
            const group = bomGroups.get(key) ?? { type: component.componentType, quantity: 0, references: [], description: properties.description ?? properties.tag, properties };
            group.quantity += 1; group.references.push(reference); bomGroups.set(key, group);
        }
        for (const instance of body.instances ?? []) {
            const locations = moduleLocations.get(instance.module) ?? new Set<string>();
            locations.add(`${circuit}:${scoped(prefix, instance.id)}`); moduleLocations.set(instance.module, locations);
        }
        for (const port of body.ports ?? []) {
            const name = prefix ? scoped(prefix, port.id) : port.id;
            const locations = portLocations.get(name) ?? new Set<string>(); locations.add(circuit); portLocations.set(name, locations);
        }

        const endpoint = (value: { component: string; pin: string }) => scoped(prefix, localEndpoint(value));
        for (const connection of body.connections) addTerminalPair(terminals, circuit, endpoint(connection.from), endpoint(connection.to), "connection");
        for (const conductor of body.conductors ?? []) {
            const properties = props(conductor.properties); const id = scoped(prefix, conductor.id);
            conductors.push({ circuit, id, from: endpoint(conductor.from), to: endpoint(conductor.to), size: properties.size, phase: properties.phase,
                cable: properties.cable ? scoped(prefix, properties.cable) : undefined, length: properties.length });
            addTerminalPair(terminals, circuit, endpoint(conductor.from), endpoint(conductor.to), "conductor");
        }
        for (const cable of body.cables ?? []) {
            const properties = props(cable.properties); const id = scoped(prefix, cable.id);
            cables.push({ circuit, id, cores: properties.cores, size: properties.size, length: properties.length,
                conductors: conductors.filter(item => item.circuit === circuit && item.cable === id).map(item => item.id).sort() });
        }
        for (const net of body.nets ?? []) for (const member of net.members) terminals.push({ circuit, endpoint: endpoint(member), connectedTo: net.name, kind: "net" });
        for (const bus of body.buses ?? []) for (const member of bus.members) terminals.push({ circuit, endpoint: endpoint(member), connectedTo: bus.name, kind: "bus" });
    }

    const crossReferences: CrossReferenceRow[] = [
        ...[...portLocations].filter(([, locations]) => locations.size > 1).map(([name, locations]) => ({ name, kind: "port" as const, locations: [...locations].sort() })),
        ...[...moduleLocations].map(([name, locations]) => ({ name, kind: "module" as const, locations: [...locations].sort() }))
    ].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));

    return {
        schema: "electrodsl-report/0.6", project: document.project.name,
        bom: [...bomGroups.values()].map(item => ({ ...item, references: item.references.sort() })).sort((a, b) => a.type.localeCompare(b.type)),
        conductors: conductors.sort(byCircuitId), cables: cables.sort(byCircuitId),
        terminals: terminals.sort((a, b) => a.circuit.localeCompare(b.circuit) || a.endpoint.localeCompare(b.endpoint) || a.connectedTo.localeCompare(b.connectedTo)),
        crossReferences
    };
}

function addTerminalPair(rows: TerminalRow[], circuit: string, from: string, to: string, kind: TerminalRow["kind"]): void {
    rows.push({ circuit, endpoint: from, connectedTo: to, kind }, { circuit, endpoint: to, connectedTo: from, kind });
}
const byCircuitId = (a: { circuit: string; id: string }, b: { circuit: string; id: string }) => a.circuit.localeCompare(b.circuit) || a.id.localeCompare(b.id);
const csv = (value: unknown) => { const text = value === undefined ? "" : String(value); return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; };
const table = (headers: string[], rows: unknown[][]) => `${[headers, ...rows].map(row => row.map(csv).join(",")).join("\n")}\n`;

export function reportCsvFiles(report: ProductionReport): Record<string, string> {
    return {
        "bom.csv": table(["type", "quantity", "references", "description", "properties"], report.bom.map(row => [row.type, row.quantity, row.references.join(";"), row.description, JSON.stringify(row.properties)])),
        "conductors.csv": table(["circuit", "id", "from", "to", "size", "phase", "cable", "length"], report.conductors.map(row => [row.circuit, row.id, row.from, row.to, row.size, row.phase, row.cable, row.length])),
        "cables.csv": table(["circuit", "id", "cores", "size", "length", "conductors"], report.cables.map(row => [row.circuit, row.id, row.cores, row.size, row.length, row.conductors.join(";")])),
        "terminals.csv": table(["circuit", "endpoint", "connectedTo", "kind"], report.terminals.map(row => [row.circuit, row.endpoint, row.connectedTo, row.kind])),
        "cross-references.csv": table(["name", "kind", "locations"], report.crossReferences.map(row => [row.name, row.kind, row.locations.join(";")]))
    };
}
