import type { PinDefinition } from "./core/PinDefinition.js";


export interface ComponentDefinition {

    /**
     * Unique ElectroDSL component identifier
     * Example: IEC-MOTOR-3PH
     */
    id: string;


    /**
     * Human readable name
     */
    name: string;


    /**
     * Component category
     * Example: motor, relay, breaker
     */
    category: string;


    /**
     * Standard reference
     * Example: IEC60617
     */
    standard?: string;


    /**
     * Alternative identifiers
     */
    aliases?: string[];



    symbol: {

        /**
         * Relative SVG path
         * Example: symbol.svg
         */
        file: string;


        width: number;


        height: number;

    };



    /**
     * Absolute library location added during loading
     */
    basePath?: string;



    terminals: PinDefinition[];



    /**
     * User configurable parameters
     */
    properties?: Record<string, string>;

}