import type { LoadedSymbol } from "../core/LoadedSymbol.js";
import type { SymbolProvider } from "./SymbolProvider.js";

/**
 * Default in-memory implementation of SymbolProvider.
 *
 * Stores already-loaded SVG symbols in memory.
 */
export class DefaultSymbolProvider
implements SymbolProvider {

    private readonly symbols =
        new Map<string, LoadedSymbol>();

    /**
     * Register a loaded symbol.
     */
    register(
        symbol: LoadedSymbol
    ): void {

        this.symbols.set(
            symbol.id,
            symbol
        );

    }

    /**
     * Returns a loaded symbol.
     */
    getSymbol(
        type: string
    ): LoadedSymbol | undefined {

        return this.symbols.get(type);

    }

    /**
     * Returns true if the symbol exists.
     */
    hasSymbol(
        type: string
    ): boolean {

        return this.symbols.has(type);

    }

    /**
     * Lists every registered symbol.
     */
    listSymbols(): string[] {

        return [...this.symbols.keys()];

    }

}