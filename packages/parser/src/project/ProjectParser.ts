import {
    ProjectNode,
    NodeKind
} from "@electrodsl/ast";
import { ProjectLoader } from "./ProjectLoader.js";

export class ProjectParser {

    private readonly loader =
        new ProjectLoader();

    parse(
        projectDirectory: string
    ): ProjectNode {

        const loaded =
            this.loader.load(
                projectDirectory
            );

        const circuits =
            loaded.documents.flatMap(
                document => document.project.circuits
            );

        return {
            kind: NodeKind.Project,
            name: loaded.manifest.name,
            version: loaded.manifest.version,
            circuits
        } satisfies ProjectNode;

    }

}