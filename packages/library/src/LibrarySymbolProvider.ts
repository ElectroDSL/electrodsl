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

import type {
    SymbolProvider
} from "./providers/SymbolProvider.js";

import type {
    LoadedSymbol
} from "./core/LoadedSymbol.js";


export class LibrarySymbolProvider
implements SymbolProvider {


    private readonly registry =
        new ComponentRegistry();


    private readonly resolver:
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
            new SymbolResolver();

    }



    getSymbol(
        type: string
    ): LoadedSymbol | undefined {


        const component =
            this.registry.get(
                type
            );


        if (!component) {

            return undefined;

        }


        const symbolPath =
            this.resolver.resolve(
                component
            );


        if (!fs.existsSync(symbolPath)) {

            return undefined;

        }


        return {

            id:
                component.id,

            svg:
                fs.readFileSync(
                    symbolPath,
                    "utf8"
                ),

            width:
                component.symbol.width,

            height:
                component.symbol.height,

            terminals:
                component.terminals

        };

    }



    hasSymbol(
        type: string
    ): boolean {

        return this.registry.has(
            type
        );

    }



    listSymbols(): string[] {

        return this.registry.list();

    }

}
