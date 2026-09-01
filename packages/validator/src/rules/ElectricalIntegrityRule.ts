import type { CircuitNode, DocumentNode, EndpointNode, PropertyNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

const endpoint = (item: EndpointNode) => item.pin ? `${item.component}.${item.pin}` : item.component;
const pair = (from: EndpointNode, to: EndpointNode) => [endpoint(from), endpoint(to)].sort().join(" ↔ ");
const props = (items: PropertyNode[]) => Object.fromEntries(items.map(item => [item.name, item.value]));

export class ElectricalIntegrityRule implements ValidationRule {
    validate(document: DocumentNode): ValidationError[] {
        if (!["0.8", "0.9", "1.0"].includes(document.version)) return [];
        const diagnostics: ValidationError[] = [];
        const portLocations = new Map<string, Array<{ circuit: string; connected: boolean }>>();
        for (const circuit of document.project.circuits) this.validateCircuit(circuit, diagnostics, portLocations);
        for (const module of document.project.modules ?? []) this.validateCircuit(module.circuit, diagnostics, new Map());
        for (const [name, locations] of portLocations) {
            if (locations.length < 2) diagnostics.push({ code: "E2310", message: `Cross-sheet port '${name}' appears on only one circuit`, severity: "warning" });
            for (const location of locations.filter(item => !item.connected)) diagnostics.push({ code: "E2311", message: `Cross-sheet port '${name}' is not electrically connected in circuit '${location.circuit}'`, severity: "warning" });
        }
        return diagnostics;
    }

    private validateCircuit(circuit: CircuitNode, diagnostics: ValidationError[], ports: Map<string, Array<{ circuit: string; connected: boolean }>>): void {
        const paths = [...circuit.connections.map(item => ({ id: "connection", from: item.from, to: item.to })), ...(circuit.conductors ?? []).map(item => ({ id: item.id, from: item.from, to: item.to }))];
        const seen = new Map<string, string>();
        for (const path of paths) {
            if (endpoint(path.from) === endpoint(path.to)) diagnostics.push({ code: "E2300", message: `Electrical path '${path.id}' in '${circuit.name}' connects an endpoint to itself`, severity: "error" });
            const key = pair(path.from, path.to); const previous = seen.get(key);
            if (previous) diagnostics.push({ code: "E2301", message: `Electrical path '${path.id}' duplicates '${previous}' between ${key}`, severity: "error" }); else seen.set(key, path.id);
        }
        const cables = new Map((circuit.cables ?? []).map(item => [item.id, item]));
        const allocation = new Map<string, string[]>();
        for (const conductor of circuit.conductors ?? []) {
            const cable = props(conductor.properties).cable;
            if (!cable) continue;
            if (!cables.has(cable)) diagnostics.push({ code: "E2302", message: `Conductor '${conductor.id}' references unknown cable '${cable}'`, severity: "error" });
            const ids = allocation.get(cable) ?? []; ids.push(conductor.id); allocation.set(cable, ids);
        }
        for (const [id, conductors] of allocation) {
            const cable = cables.get(id); if (!cable) continue;
            const cores = Number(props(cable.properties).cores);
            if (Number.isFinite(cores) && conductors.length > cores) diagnostics.push({ code: "E2303", message: `Cable '${id}' has ${cores} cores but ${conductors.length} conductors are allocated`, severity: "error" });
        }
        const connected = new Set(paths.flatMap(item => [item.from.component, item.to.component]));
        for (const net of circuit.nets ?? []) for (const member of net.members) connected.add(member.component);
        for (const bus of circuit.buses ?? []) for (const member of bus.members) connected.add(member.component);
        for (const component of circuit.components.filter(item => !connected.has(item.id))) diagnostics.push({ code: "E2304", message: `Component '${component.id}' is electrically isolated in circuit '${circuit.name}'`, severity: "warning" });
        for (const port of circuit.ports ?? []) { const entries = ports.get(port.id) ?? []; entries.push({ circuit: circuit.name, connected: connected.has(port.id) }); ports.set(port.id, entries); }
    }
}
