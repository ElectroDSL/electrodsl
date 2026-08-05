import type { SymbolDefinition } from "../core/SymbolDefinition.js";

/**
 * Provides schematic symbol definitions.
 */
export interface SymbolProvider {

    /**
     * Retrieve a symbol definition by component type.
     *
     * Examples:
     * - resistor
     * - capacitor
     * - relay
     * - plc
     */
    getSymbol(
        type: string
    ): SymbolDefinition | undefined;

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