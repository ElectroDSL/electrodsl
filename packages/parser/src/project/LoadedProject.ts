import type { DocumentNode } from "@electrodsl/ast";
import type { ProjectManifest } from "./ProjectManifest.js";

export interface LoadedProject {

    manifest: ProjectManifest;

    documents: DocumentNode[];

}