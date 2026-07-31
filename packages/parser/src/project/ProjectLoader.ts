import { readFileSync } from "node:fs";
import path from "node:path";

import { parseFile } from "../api/parseFile.js";

import type { ProjectManifest } from "./ProjectManifest.js";
import type { LoadedProject } from "./LoadedProject.js";

export class ProjectLoader {

    load(
        projectDirectory: string
    ): LoadedProject {

        const manifestPath =
            path.join(
                projectDirectory,
                "electrodsl.json"
            );

        const manifest =
            JSON.parse(
                readFileSync(
                    manifestPath,
                    "utf-8"
                )
            ) as ProjectManifest;

        const documents =
            manifest.circuits.map(file =>

                parseFile(
                    path.join(
                        projectDirectory,
                        file
                    )
                )

            );

        return {

            manifest,

            documents

        };

    }

}