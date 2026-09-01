import type { DocumentNode } from "@electrodsl/ast";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

interface SymbolLookup {
    getSymbol(type: string): {
        terminals?: Array<{ id: string; name: string }>;
    } | undefined;
}

export class ElectricalReferenceRule implements ValidationRule {
    constructor(
        private readonly symbols: SymbolLookup
    ) {}

    validate(document: DocumentNode): ValidationError[] {
        const errors: ValidationError[] = [];

        for (const circuit of [
            ...document.project.circuits,
            ...(document.project.modules ?? []).map(module => module.circuit)
        ]) {
            const components = new Map(
                circuit.components.map(component => [component.id, component])
            );
            const junctions = new Set(
                [
                    ...(circuit.junctions ?? []).map(junction => junction.id),
                    ...(circuit.ports ?? []).map(port => port.id)
                ]
            );
            const modules = new Map((document.project.modules ?? []).map(module => [module.name, module]));
            const instances = new Map((circuit.instances ?? []).map(instance => [instance.id, instance]));

            for (const component of circuit.components) {
                if (!this.symbols.getSymbol(component.componentType)) {
                    errors.push({
                        code: "E2001",
                        message: `Unknown component type '${component.componentType}' on '${component.id}'`,
                        severity: "error"
                    });
                }
            }

            const endpoints = [
                ...circuit.connections.flatMap(connection => [
                    connection.from,
                    connection.to
                ]),
                ...(circuit.nets ?? []).flatMap(net => net.members)
                ,...(circuit.conductors ?? []).flatMap(conductor => [conductor.from, conductor.to])
                ,...(circuit.buses ?? []).flatMap(bus => bus.members)
            ];

            for (const endpoint of endpoints) {
                const instance = instances.get(endpoint.component);
                if (instance) {
                    const module = modules.get(instance.module);
                    if (!module?.ports.some(port => port.id === endpoint.pin)) {
                        errors.push({ code: "E2006", message: `Unknown port '${endpoint.pin}' on module instance '${endpoint.component}'`, severity: "error" });
                    }
                    continue;
                }
                if (junctions.has(endpoint.component)) {
                    if (endpoint.pin) {
                        errors.push({
                            code: "E2004",
                        message: `Junction or sheet port '${endpoint.component}' cannot have terminal '${endpoint.pin}'`,
                            severity: "error"
                        });
                    }
                    continue;
                }

                const component = components.get(endpoint.component);
                if (!component) {
                    errors.push({
                        code: "E2002",
                        message: `Unknown component or junction '${endpoint.component}'`,
                        severity: "error"
                    });
                    continue;
                }

                const symbol = this.symbols.getSymbol(component.componentType);
                if (!symbol) {
                    continue;
                }

                const terminal = symbol.terminals?.find(item =>
                    item.id === endpoint.pin || item.name === endpoint.pin
                );
                if (!terminal) {
                    const available = symbol.terminals
                        ?.map(item => item.id)
                        .join(", ") || "none";
                    errors.push({
                        code: "E2003",
                        message: `Unknown terminal '${endpoint.pin}' on '${endpoint.component}'. Available: ${available}`,
                        severity: "error"
                    });
                }
            }
        }

        return errors;
    }
}
