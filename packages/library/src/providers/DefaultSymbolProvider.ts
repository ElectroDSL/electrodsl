import type { SymbolDefinition } from "../core/SymbolDefinition.js";
import type { SymbolProvider } from "./SymbolProvider.js";

/**
 * Default in-memory implementation of SymbolProvider.
 */
export class DefaultSymbolProvider implements SymbolProvider {

    private readonly symbols =
        new Map<string, SymbolDefinition>();

    /**
     * Register a symbol.
     */
    register(
        symbol: SymbolDefinition
    ): void {

        this.symbols.set(
            symbol.id,
            symbol
        );

    }

    /**
     * Returns a symbol definition.
     */
    getSymbol(
        type: string
    ): SymbolDefinition | undefined {

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