import fs from "fs";
import path from "path";

import { ComponentDefinition } from "../ComponentDefinition.js";


export class SymbolResolver {


    constructor(
        private libraryRoot: string
    ) { }



    resolve(
        component: ComponentDefinition
    ) {


        const symbolPath =
            path.join(
                component.basePath!,
                component.symbol.file
            );


        if (!fs.existsSync(symbolPath)) {
            throw new Error(
                `Symbol not found: ${symbolPath}`
            );
        }


        return symbolPath;

    }


}