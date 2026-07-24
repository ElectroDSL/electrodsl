import { PinDefinition } from "./core/PinDefinition.js";


export interface ComponentDefinition {


    id: string;


    name: string;


    category: string;


    standard: string;


    aliases?: string[];


    symbol: {
        file: string;
        width: number;
        height: number;
    };

    basePath?: string;
    
    terminals: PinDefinition[];


    properties: Record<string, string>;

}