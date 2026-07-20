import { NodeKind } from "../enums/NodeKind.js";
import { Position } from "./Position.js";

export interface AstNode {

    kind: NodeKind;

    id?: string;

    name?: string;

    position?: Position;

}
