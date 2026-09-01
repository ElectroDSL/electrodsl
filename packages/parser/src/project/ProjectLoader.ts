import { readFileSync } from "node:fs";
import path from "node:path";

import { parseFile } from "../api/parseFile.js";

import type { ProjectManifest } from "./ProjectManifest.js";
import type { LoadedProject } from "./LoadedProject.js";

export class ProjectLoader {

    load(
        projectDirectory: string
    ): LoadedProject {

        const projectRoot = path.resolve(projectDirectory);

        const manifestPath =
            path.join(
                projectRoot,
                "electrodsl.json"
            );

        const manifest =
            JSON.parse(
                readFileSync(
                    manifestPath,
                    "utf-8"
                )
            ) as ProjectManifest;

        this.validateManifest(manifest);

        const documents = manifest.circuits.map(file =>
            parseFile(this.resolveInside(projectRoot, file))
        );

        return {

            manifest,

            documents

        };

    }

    private validateManifest(manifest: ProjectManifest): void {
        if (manifest.schema && !["electrodsl-project/0.6", "electrodsl-project/0.7", "electrodsl-project/0.8", "electrodsl-project/0.9"].includes(manifest.schema)) throw new Error(`Unsupported project schema '${manifest.schema}'`);
        if (!manifest.name || !manifest.version) throw new Error("Project name and version are required");
        if (!Array.isArray(manifest.circuits) || manifest.circuits.length === 0) throw new Error("Project requires at least one circuit source");
        if (manifest.circuits.some(file => typeof file !== "string" || !file.trim())) throw new Error("Project circuit sources must be non-empty strings");
        if (new Set(manifest.circuits).size !== manifest.circuits.length) throw new Error("Project circuit sources must be unique");
        if (manifest.language && !["0.6", "0.7", "0.8", "0.9"].includes(manifest.language)) throw new Error(`Unsupported project language '${manifest.language}'`);
        if (manifest.output && (typeof manifest.output.directory !== "string" || !manifest.output.directory.trim() || manifest.output.format !== "svg")) throw new Error("Project output requires a directory and SVG format");
    }

    private resolveInside(root: string, requested: string): string {
        const resolved = path.resolve(root, requested);
        const relative = path.relative(root, resolved);
        if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Project path escapes its directory: '${requested}'`);
        if (path.extname(resolved).toLowerCase() !== ".edsl") throw new Error(`Project source must use .edsl: '${requested}'`);
        return resolved;
    }

}
