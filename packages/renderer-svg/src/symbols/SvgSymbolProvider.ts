import fs from "fs";
import path from "path";

import {
    ComponentRegistry,
    LibraryScanner,
    SymbolResolver
} from "@electrodsl/library";

export class SvgSymbolProvider {

    private registry = new ComponentRegistry();
    private initialized = false;

    private initialize() {

        if (this.initialized) {
            return;
        }

        const scanner = new LibraryScanner(
            "packages/library/library"
        );

        scanner.scan(this.registry);

        this.initialized = true;
    }

    getSymbol(type: string): string | undefined {

        this.initialize();

        const component = this.registry.get(type);

        if (!component) {
            return undefined;
        }

        // Temporary resolution based on category
        const resolver = new SymbolResolver(
            path.join(
                "packages/library/library/iec",
                component.category
            )
        );

        const svgPath = resolver.resolve(component);

        return fs.readFileSync(svgPath, "utf8");
    }

}

export const symbolProvider =
    new SvgSymbolProvider();