import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { ComponentNode } from "./ComponentNode.js";
import { ConnectionNode } from "./ConnectionNode.js";
import { TerminalNode } from "./TerminalNode.js";
import { WireNode } from "./WireNode.js";
import { NetNode } from "./NetNode.js";
import { JunctionNode } from "./JunctionNode.js";
import type { BusNode, CableNode, ConductorNode, InstanceNode, PortNode } from "./EngineeringNodes.js";


export interface CircuitNode extends AstNode {

    kind: NodeKind.Circuit;

    name: string;

    components: ComponentNode[];

    connections: ConnectionNode[];

    terminals?: TerminalNode[];

    wires?: WireNode[];

    nets?: NetNode[];

    junctions?: JunctionNode[];

    conductors?: ConductorNode[];

    cables?: CableNode[];

    buses?: BusNode[];

    ports?: PortNode[];

    instances?: InstanceNode[];

}
