import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { CircuitNode } from "./CircuitNode.js";


export interface ProjectNode extends AstNode {

    kind: NodeKind.Project;

    name: string;

    circuits: CircuitNode[];

}