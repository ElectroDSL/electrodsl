import fs from "node:fs";

import {
    ComponentRegistry
} from "./registry/ComponentRegistry.js";

import {
    LibraryScanner
} from "./loader/LibraryScanner.js";

import {
    SymbolResolver
} from "./loader/SymbolResolver.js";


export class SymbolProvider {


    private registry =
        new ComponentRegistry();


    private resolver:
        SymbolResolver;


    constructor(
        private readonly libraryRoot: string
    ) {


        const scanner =
            new LibraryScanner(
                libraryRoot
            );


        scanner.scan(
            this.registry
        );


        this.resolver =
            new SymbolResolver(
                libraryRoot
            );

    }



    getSymbol(
        type: string
    ): string | undefined {


        const component =
            this.registry.get(type);


        if (!component) {

            console.warn(
                `Component not found: ${type}`
            );

            return undefined;

        }


        const symbolPath =
            this.resolver.resolve(
                component
            );


        return fs.readFileSync(
            symbolPath,
            "utf8"
        );

    }

}