import { NodeKind } from "../enums/NodeKind.js";
import type { AstNode } from "./AstNode.js";
import type { CircuitNode } from "./CircuitNode.js";
import type { PropertyNode } from "./PropertyNode.js";

export interface EndpointNode { component: string; pin: string }

export interface ConductorNode extends AstNode {
    kind: NodeKind.Conductor;
    id: string;
    from: EndpointNode;
    to: EndpointNode;
    properties: PropertyNode[];
}

export interface CableNode extends AstNode {
    kind: NodeKind.Cable;
    id: string;
    properties: PropertyNode[];
}

export interface BusNode extends AstNode {
    kind: NodeKind.Bus;
    name: string;
    properties: PropertyNode[];
    members: EndpointNode[];
}

export interface PortNode extends AstNode {
    kind: NodeKind.Port;
    id: string;
}

export interface ModuleNode extends AstNode {
    kind: NodeKind.Module;
    name: string;
    ports: PortNode[];
    circuit: CircuitNode;
}

export interface InstanceNode extends AstNode {
    kind: NodeKind.Instance;
    id: string;
    module: string;
}
