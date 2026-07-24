import fs from "fs";
import path from "path";


import {
    ComponentRegistry,
    SymbolResolver,
    LibraryScanner
}
from "@electrodsl/library";


import {
    symbolCache
}
from "./SymbolCache.js";



class SymbolProvider {


    private registry =
        new ComponentRegistry();



    private resolver:
        SymbolResolver;



    constructor(){


        const libraryRoot =
            path.resolve(
                process.cwd(),
                "packages/library/library"
            );



        const scanner =
            new LibraryScanner(
                libraryRoot
            );


        scanner.scan(
            this.registry
        );



        this.resolver =
            new SymbolResolver(
                libraryRoot
            );

    }



    getSymbol(
        type:string
    ):string | undefined {


        const cached =
            symbolCache.get(type);



        if(cached){

            return cached;

        }



        const component =
            this.registry.get(type);



        if(!component){

            console.warn(
                `Component not found: ${type}`
            );

            return undefined;

        }



        const symbolPath =
            this.resolver.resolve(
                component
            );



        const svg =
            fs.readFileSync(
                symbolPath,
                "utf-8"
            );



        symbolCache.set(
            type,
            svg
        );


        return svg;

    }


}



export const symbolProvider =
    new SymbolProvider();