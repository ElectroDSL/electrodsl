import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";

export interface NetNode extends AstNode {

    kind: NodeKind.Net;

    name: string;

}
