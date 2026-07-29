import fs from "node:fs";

import { ComponentRegistry } from "./registry/ComponentRegistry.js";
import { LibraryScanner } from "./loader/LibraryScanner.js";
import { SymbolResolver } from "./loader/SymbolResolver.js";

export class SymbolProvider {

    private readonly registry = new ComponentRegistry();

    private readonly resolver: SymbolResolver;

    constructor(
        private readonly libraryRoot: string
    ) {

        const scanner = new LibraryScanner(
            this.libraryRoot
        );

        scanner.scan(this.registry);

        this.resolver = new SymbolResolver();

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
            this.resolver.resolve(component);

        if (!fs.existsSync(symbolPath)) {

            console.warn(
                `Symbol not found: ${symbolPath}`
            );

            return undefined;

        }

        return fs.readFileSync(
            symbolPath,
            "utf8"
        );

    }

}