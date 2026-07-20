import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";
import { PinRefNode } from "./PinRefNode.js";

export interface WireNode extends AstNode {

    kind: NodeKind.Wire;

    from: PinRefNode;

    to: PinRefNode;

}
