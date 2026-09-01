import type { CircuitNode, DocumentNode, EndpointNode } from "@electrodsl/ast";

export interface CircuitConnectivity { circuit: string; components: number; electricalPaths: number; nets: number; buses: number; isolatedComponents: string[] }
export interface PortConnectivity { name: string; circuits: string[]; connectedCircuits: string[]; dangling: boolean }
export interface ConnectivityAnalysis { schema: "electrodsl-connectivity/0.8" | "electrodsl-connectivity/1.0"; project: string; circuits: CircuitConnectivity[]; ports: PortConnectivity[]; totals: { components: number; electricalPaths: number; isolatedComponents: number; danglingPorts: number } }

const endpointName = (endpoint: EndpointNode) => endpoint.pin ? `${endpoint.component}.${endpoint.pin}` : endpoint.component;

export function circuitEndpoints(circuit: CircuitNode): EndpointNode[] {
    return [
        ...circuit.connections.flatMap(item => [item.from, item.to]),
        ...(circuit.conductors ?? []).flatMap(item => [item.from, item.to]),
        ...(circuit.nets ?? []).flatMap(item => item.members),
        ...(circuit.buses ?? []).flatMap(item => item.members)
    ];
}

export function analyzeConnectivity(document: DocumentNode): ConnectivityAnalysis {
    const portMap = new Map<string, Array<{ circuit: string; connected: boolean }>>();
    const circuits = document.project.circuits.map(circuit => {
        const endpoints = circuitEndpoints(circuit);
        const connected = new Set(endpoints.map(item => item.component));
        for (const port of circuit.ports ?? []) {
            const entries = portMap.get(port.id) ?? [];
            entries.push({ circuit: circuit.name, connected: connected.has(port.id) });
            portMap.set(port.id, entries);
        }
        return {
            circuit: circuit.name,
            components: circuit.components.length,
            electricalPaths: circuit.connections.length + (circuit.conductors?.length ?? 0),
            nets: circuit.nets?.length ?? 0,
            buses: circuit.buses?.length ?? 0,
            isolatedComponents: circuit.components.filter(item => !connected.has(item.id)).map(item => item.id).sort()
        };
    }).sort((a, b) => a.circuit.localeCompare(b.circuit));
    const ports = [...portMap].map(([name, entries]) => ({ name, circuits: entries.map(item => item.circuit).sort(), connectedCircuits: entries.filter(item => item.connected).map(item => item.circuit).sort(), dangling: entries.length < 2 || entries.some(item => !item.connected) })).sort((a, b) => a.name.localeCompare(b.name));
    return { schema: document.version === "1.0" ? "electrodsl-connectivity/1.0" : "electrodsl-connectivity/0.8", project: document.project.name, circuits, ports, totals: {
        components: circuits.reduce((sum, item) => sum + item.components, 0), electricalPaths: circuits.reduce((sum, item) => sum + item.electricalPaths, 0),
        isolatedComponents: circuits.reduce((sum, item) => sum + item.isolatedComponents.length, 0), danglingPorts: ports.filter(item => item.dangling).length
    } };
}

export { endpointName };
