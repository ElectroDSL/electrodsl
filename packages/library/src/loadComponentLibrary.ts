import path from "node:path";
import fs from "node:fs";

import {
    LibraryScanner
} from "./loader/LibraryScanner.js";

import {
    ComponentRegistry
} from "./registry/ComponentRegistry.js";


export function loadComponentLibrary(
    folder:string
): ComponentRegistry {


    let root = folder;


    if(!path.isAbsolute(root)){

        const fromPackage =
            path.resolve(
                process.cwd(),
                root
            );


        if(fs.existsSync(fromPackage)){

            root = fromPackage;

        }
        else {

            root =
                path.resolve(
                    process.cwd(),
                    "library"
                );

        }

    }


    const registry =
        new ComponentRegistry();


    const scanner =
        new LibraryScanner(root);


    scanner.scan(
        registry
    );


    return registry;

}