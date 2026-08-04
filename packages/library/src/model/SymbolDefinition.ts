import type { SymbolBounds } from "./SymbolBounds.js";
import type { SymbolPort } from "./SymbolPort.js";

/**
 * Complete definition of a schematic symbol.
 */
export interface SymbolDefinition {

    /**
     * Unique symbol name.
     */
    name: string;

    /**
     * Category.
     */
    category: string;

    /**
     * Drawing bounds.
     */
    bounds: SymbolBounds;

    /**
     * Connection ports.
     */
    ports: SymbolPort[];

}