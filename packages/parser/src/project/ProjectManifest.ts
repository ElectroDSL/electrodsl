export interface ProjectManifest {

    schema?: "electrodsl-project/0.6" | "electrodsl-project/0.7" | "electrodsl-project/0.8" | "electrodsl-project/0.9";

    name: string;

    version: string;

    language?: string;

    description?: string;

    circuits: string[];

    library?: string[];

    output?: {

        directory: string;

        format: "svg";

    };

    reports?: boolean;

}
