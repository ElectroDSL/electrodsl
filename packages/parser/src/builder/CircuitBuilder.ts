import {
    CircuitNode,
    NodeKind
} from "@electrodsl/ast";


export function buildCircuit(
    name: string
): CircuitNode {

    return {

        kind: NodeKind.Circuit,

        name,

        components: [],

        connections: []

    };

}