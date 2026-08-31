import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { CircuitNode } from "./CircuitNode.js";

export interface ProjectNode extends AstNode {

    kind: NodeKind.Project;

    /**
     * Project name
     */
    name: string;

    /**
     * Version of the project
     */
    version?: string;

    /**
     * Optional author
     */
    author?: string;

    /**
     * Imported libraries
     */
    libraries?: string[];

    /**
     * Source documents that produced this project
     */
    sourceFiles?: string[];

    /**
     * All circuits in the project
     */
    circuits: CircuitNode[];

}