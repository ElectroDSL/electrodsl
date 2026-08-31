import type { LoadedSymbol } from "../core/LoadedSymbol.js";

/**
 * Provides loaded schematic symbols for rendering.
 */
export interface SymbolProvider {

    /**
     * Retrieve a loaded symbol by component type.
     */
    getSymbol(
        type: string
    ): LoadedSymbol | undefined;

    /**
     * Returns true if a symbol exists.
     */
    hasSymbol(
        type: string
    ): boolean;

    /**
     * Returns all available symbol types.
     */
    listSymbols(): string[];

}