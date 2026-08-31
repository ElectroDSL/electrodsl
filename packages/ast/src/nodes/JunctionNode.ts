import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";

export interface JunctionNode extends AstNode {
    kind: NodeKind.Junction;
    id: string;
}
