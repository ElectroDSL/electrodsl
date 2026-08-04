import type { SymbolDefinition } from "../model/SymbolDefinition.js";

/**
 * Provides schematic symbol definitions.
 */
export interface SymbolProvider {

    /**
     * Retrieve a symbol by name.
     */
    getSymbol(name: string): SymbolDefinition | undefined;


    /**
     * Check whether a symbol exists.
     */
    hasSymbol(name: string): boolean;


    /**
     * List available symbols.
     */
    listSymbols(): string[];

}