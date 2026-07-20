import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";


export interface CircuitNode extends AstNode {

    kind: NodeKind.Circuit;

    name: string;

}