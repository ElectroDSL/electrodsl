import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { ComponentNode } from "./ComponentNode.js";
import { ConnectionNode } from "./ConnectionNode.js";


export interface CircuitNode extends AstNode {

    kind: NodeKind.Circuit;

    name: string;

    components: ComponentNode[];

    connections: ConnectionNode[];

}