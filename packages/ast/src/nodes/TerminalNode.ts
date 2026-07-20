import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";

export interface TerminalNode extends AstNode {

    kind: NodeKind.Terminal;

    id: string;

    name?: string;

}
