import {
    DocumentNode,
    NodeKind,
    ProjectNode,
    CircuitNode
} from "@electrodsl/ast";


export function buildProject(
    name: string,
    circuits: CircuitNode[] = []
): DocumentNode {


    const project: ProjectNode = {

        kind: NodeKind.Project,

        name,

        circuits

    };


    return {

        kind: NodeKind.Document,

        version: "0.1",

        project

    };

}