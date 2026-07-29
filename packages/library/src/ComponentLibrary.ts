import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type {
    ComponentDefinition
} from "./ComponentDefinition.js";


export class ComponentLibrary {


    private definitions =
        new Map<string, ComponentDefinition>();


    register(
        definition: ComponentDefinition
    ): void {


        this.definitions.set(
            definition.id,
            definition
        );

    }



    get(
        id: string
    ): ComponentDefinition | undefined {


        return this.definitions.get(id);

    }



    values(): ComponentDefinition[] {


        return [
            ...this.definitions.values()
        ];

    }

}



export function loadComponentDefinition(
    path: string
): ComponentDefinition {


    const definition: unknown =
        JSON.parse(
            readFileSync(
                path,
                "utf-8"
            )
        );


    if (!isComponentDefinition(definition)) {

        throw new Error(
            `Invalid ElectroDSL component definition: ${path}`
        );

    }


    return definition;

}




export function loadComponentLibrary(
    directory: string
): ComponentLibrary {


    const library =
        new ComponentLibrary();


    for (const file of readdirSync(directory)) {


        if (file.endsWith(".json")) {


            library.register(
                loadComponentDefinition(
                    join(directory, file)
                )
            );

        }

    }


    return library;

}




function isComponentDefinition(
    value: unknown
): value is ComponentDefinition {


    if (
        !value ||
        typeof value !== "object"
    ) {

        return false;

    }


    const definition =
        value as Partial<ComponentDefinition>;



    return (

        typeof definition.id === "string"

        &&

        typeof definition.name === "string"

        &&

        typeof definition.symbol === "object"

        &&

        definition.symbol !== null

        &&

        typeof definition.symbol.file === "string"

        &&

        Array.isArray(definition.terminals)

    );

}