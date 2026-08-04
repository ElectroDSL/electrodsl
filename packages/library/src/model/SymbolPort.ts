import { PortSide } from "./PortSide.js";

/**
 * Symbol connection point.
 */
export interface SymbolPort {

    /**
     * Port identifier.
     */
    id: string;

    /**
     * Display name.
     */
    name: string;

    /**
     * Port location.
     */
    side: PortSide;

    /**
     * Position relative to the symbol.
     */
    x: number;

    y: number;

}