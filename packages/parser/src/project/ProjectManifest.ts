export interface ProjectManifest {

    schema?: "electrodsl-project/0.6";

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
