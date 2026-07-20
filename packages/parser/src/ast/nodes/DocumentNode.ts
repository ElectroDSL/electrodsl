import { AstNode } from "./AstNode";
import { NodeKind } from "../enums/NodeKind";
import { ProjectNode } from "./ProjectNode";

export interface DocumentNode extends AstNode {

    kind: NodeKind.Document;

    version: string;

    project: ProjectNode;

}