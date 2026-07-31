import fs from "node:fs";
import path from "node:path";

import type { ComponentDefinition } from "../ComponentDefinition.js";


export class LibraryLoader {


    private libraryRoot?: string;


    constructor(
    libraryRoot?: string
){

    this.libraryRoot =
        libraryRoot ??
        path.resolve(
            process.cwd(),
            "library"
        );

}


    load(
        file: string
    ): ComponentDefinition {

        try {

            const json =
                fs.readFileSync(
                    file,
                    "utf8"
                );


            const component =
                JSON.parse(json) as ComponentDefinition;


            if (!component.id) {
                throw new Error("Missing component id.");
            }


            if (!component.name) {
                throw new Error("Missing component name.");
            }


            if (!component.symbol?.file) {
                throw new Error("Missing symbol file.");
            }


            component.basePath =
                path.dirname(file);


            component.aliases ??= [];

            component.properties ??= {};

            component.terminals ??= [];


            return component;


        }
        catch(error){

            throw new Error(
                `Failed to load component '${file}': ${error}`
            );

        }

    }



    async loadComponent(
        id:string
    ):Promise<ComponentDefinition>{


        if(!this.libraryRoot){

            throw new Error(
                "Library root not configured."
            );

        }


        const parts =
            id.split(".");


        const file =
            path.join(
                this.libraryRoot,
                ...parts,
                "component.json"
            );


        return this.load(file);

    }

}