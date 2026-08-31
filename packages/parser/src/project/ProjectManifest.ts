export interface ProjectManifest {

    name: string;

    version: string;

    description?: string;

    circuits: string[];

    library?: string[];

    output?: {

        directory: string;

        format: "svg" | "pdf";

    };

}