import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { PropertyNode } from "./PropertyNode.js";


export interface ComponentNode extends AstNode {

    kind: NodeKind.Component;

    id: string;

    componentType: string;

    properties: PropertyNode[];

}