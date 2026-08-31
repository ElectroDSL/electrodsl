import type { DocumentNode } from "@electrodsl/ast";

export const CANONICAL_IR_SCHEMA = "https://electrodsl.org/schema/ir/0.3";

export interface CanonicalEndpoint {
    component: string;
    terminal?: string;
}

export interface CanonicalIR {
    $schema: typeof CANONICAL_IR_SCHEMA;
    language: { name: "ElectroDSL"; version: string };
    project: {
        name: string;
        circuits: Array<{
            name: string;
            electrical: {
                components: Array<{
                    id: string;
                    type: string;
                    properties: Record<string, string>;
                }>;
                junctions: Array<{ id: string }>;
                connections: Array<{ from: CanonicalEndpoint; to: CanonicalEndpoint }>;
                nets: Array<{ name: string; members: CanonicalEndpoint[] }>;
            };
            presentation: {
                routes: Array<{ connection: number; preference: "auto" | "above" | "below" }>;
            };
        }>;
    };
}

function endpoint(value: { component: string; pin: string }): CanonicalEndpoint {
    return value.pin
        ? { component: value.component, terminal: value.pin }
        : { component: value.component };
}

/** Converts the parser AST to the stable, renderer-independent v0.3 JSON IR. */
export function toCanonicalIR(document: DocumentNode): CanonicalIR {
    return {
        $schema: CANONICAL_IR_SCHEMA,
        language: { name: "ElectroDSL", version: document.version },
        project: {
            name: document.project.name,
            circuits: document.project.circuits.map(circuit => ({
                name: circuit.name,
                electrical: {
                    components: circuit.components.map(component => ({
                        id: component.id,
                        type: component.componentType,
                        properties: Object.fromEntries(
                            component.properties.map(property => [property.name, property.value])
                        )
                    })),
                    junctions: (circuit.junctions ?? []).map(({ id }) => ({ id })),
                    connections: circuit.connections.map(connection => ({
                        from: endpoint(connection.from),
                        to: endpoint(connection.to)
                    })),
                    nets: (circuit.nets ?? []).map(net => ({
                        name: net.name,
                        members: net.members.map(endpoint)
                    }))
                },
                presentation: {
                    routes: circuit.connections.flatMap((connection, index) =>
                        connection.route
                            ? [{ connection: index, preference: connection.route }]
                            : []
                    )
                }
            }))
        }
    };
}

export function serializeCanonicalIR(document: DocumentNode): string {
    return `${JSON.stringify(toCanonicalIR(document), null, 2)}\n`;
}
