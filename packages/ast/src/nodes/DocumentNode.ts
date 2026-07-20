import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { ProjectNode } from "./ProjectNode.js";


export interface DocumentNode extends AstNode {

    kind: NodeKind.Document;

    version: string;

    project: ProjectNode;

}