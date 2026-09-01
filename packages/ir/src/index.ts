import type { CircuitNode, DocumentNode, PropertyNode } from "@electrodsl/ast";
import { parseEngineeringValue, type EngineeringValue } from "@electrodsl/engineering";

export const CANONICAL_IR_SCHEMA = "https://electrodsl.org/schema/ir/0.4";
export const STABLE_IR_SCHEMA = "https://electrodsl.org/schema/ir/1.0";

export interface CanonicalEndpoint { component: string; terminal?: string }
export interface CanonicalProperties { source: Record<string, string>; normalized: Record<string, EngineeringValue> }
export interface CanonicalCircuit {
    name: string;
    electrical: {
        components: Array<{ id: string; type: string; properties: CanonicalProperties }>;
        junctions: Array<{ id: string }>;
        ports: Array<{ id: string }>;
        instances: Array<{ id: string; module: string }>;
        connections: Array<{ from: CanonicalEndpoint; to: CanonicalEndpoint }>;
        nets: Array<{ name: string; members: CanonicalEndpoint[] }>;
        conductors: Array<{ id: string; from: CanonicalEndpoint; to: CanonicalEndpoint; properties: CanonicalProperties }>;
        cables: Array<{ id: string; properties: CanonicalProperties }>;
        buses: Array<{ name: string; members: CanonicalEndpoint[]; properties: CanonicalProperties }>;
    };
    presentation: { routes: Array<{ connection: number; preference: "auto" | "above" | "below" }> };
}
export interface CanonicalIR {
    $schema: typeof CANONICAL_IR_SCHEMA | typeof STABLE_IR_SCHEMA;
    language: { name: "ElectroDSL"; version: string };
    project: {
        name: string;
        modules: Array<{ name: string; ports: Array<{ id: string }>; body: CanonicalCircuit }>;
        circuits: CanonicalCircuit[];
    };
}

const endpoint = (value: { component: string; pin: string }): CanonicalEndpoint =>
    value.pin ? { component: value.component, terminal: value.pin } : { component: value.component };

function canonicalProperties(items: PropertyNode[]): CanonicalProperties {
    const source = Object.fromEntries(items.map(item => [item.name, item.value]));
    const normalized = Object.fromEntries(items.flatMap(item => {
        const parsed = parseEngineeringValue(item.value);
        return parsed ? [[item.name, parsed]] : [];
    }));
    return { source, normalized };
}

function circuit(body: CircuitNode): CanonicalCircuit {
    return {
        name: body.name,
        electrical: {
            components: body.components.map(component => ({
                id: component.id, type: component.componentType,
                properties: canonicalProperties(component.properties)
            })),
            junctions: (body.junctions ?? []).map(({ id }) => ({ id })),
            ports: (body.ports ?? []).map(({ id }) => ({ id })),
            instances: (body.instances ?? []).map(({ id, module }) => ({ id, module })),
            connections: body.connections.map(connection => ({ from: endpoint(connection.from), to: endpoint(connection.to) })),
            nets: (body.nets ?? []).map(net => ({ name: net.name, members: net.members.map(endpoint) })),
            conductors: (body.conductors ?? []).map(item => ({
                id: item.id, from: endpoint(item.from), to: endpoint(item.to), properties: canonicalProperties(item.properties)
            })),
            cables: (body.cables ?? []).map(item => ({ id: item.id, properties: canonicalProperties(item.properties) })),
            buses: (body.buses ?? []).map(item => ({
                name: item.name, members: item.members.map(endpoint), properties: canonicalProperties(item.properties)
            }))
        },
        presentation: {
            routes: body.connections.flatMap((connection, index) => connection.route
                ? [{ connection: index, preference: connection.route }] : [])
        }
    };
}

export function toCanonicalIR(document: DocumentNode): CanonicalIR {
    return {
        $schema: document.version === "1.0" ? STABLE_IR_SCHEMA : CANONICAL_IR_SCHEMA,
        language: { name: "ElectroDSL", version: document.version },
        project: {
            name: document.project.name,
            modules: (document.project.modules ?? []).map(module => ({
                name: module.name, ports: module.ports.map(({ id }) => ({ id })), body: circuit(module.circuit)
            })),
            circuits: document.project.circuits.map(circuit)
        }
    };
}

export function serializeCanonicalIR(document: DocumentNode): string { return `${JSON.stringify(toCanonicalIR(document), null, 2)}\n`; }
