import type { PinDefinition } from "./PinDefinition.js";


/**
 * Complete electrical symbol definition.
 */
export interface SymbolDefinition {

    /**
     * Unique symbol identifier.
     */
    id:string;


    /**
     * Source symbol file.
     */
    file:string;


    /**
     * Symbol size.
     */
    width:number;


    /**
     * Symbol size.
     */
    height:number;


    /**
     * Electrical connection pins.
     */
    pins: PinDefinition[];

}