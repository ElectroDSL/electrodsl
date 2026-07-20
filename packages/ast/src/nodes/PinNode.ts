import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";

export interface PinNode extends AstNode {

    kind: NodeKind.Pin;

    name: string;

    side?: "left" | "right" | "top" | "bottom";

    direction?: "input" | "output" | "bidirectional" | "power" | "passive";

}