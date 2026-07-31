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



import type { LoadedSymbol } from "./core/LoadedSymbol.js";



export class SymbolProvider {

    private registry =
        new ComponentRegistry();

    private resolver: SymbolResolver;

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
    ): LoadedSymbol  | undefined {

        const component =
            this.registry.get(type);

        if (!component)
            return undefined;

        const symbolPath =
            this.resolver.resolve(
                component
            );

        return {

            id: component.id,

            svg: fs.readFileSync(
                symbolPath,
                "utf8"
            ),

            width: component.symbol.width,

            height: component.symbol.height

        };

    }

}