import { describe, expect, it } from "vitest";
import path from "node:path";

import {
    LibraryScanner,
    ComponentRegistry,
    SymbolResolver,
    FileSymbolProvider
} from "../src/index.js";


describe(
"IEC File Library",
()=>{


it(
"loads motor SVG symbol",
()=>{


const libraryPath =
path.resolve(
    "library"
);



const scanner =
new LibraryScanner();



const registry =
new ComponentRegistry();



scanner.scan(
    libraryPath,
    registry
);



const resolver =
new SymbolResolver(
    registry
);



const provider =
new FileSymbolProvider(
    resolver
);



const symbol =
provider.getSymbol(
    "IEC-MOTOR-3PH"
);



expect(symbol)
.toContain(
    "<svg"
);



});


});