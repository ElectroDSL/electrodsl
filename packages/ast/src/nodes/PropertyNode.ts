import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";


export interface PropertyNode extends AstNode {

    kind: NodeKind.Property;

    name: string;

    value: string;

}