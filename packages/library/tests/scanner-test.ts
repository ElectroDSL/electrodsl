import {

ComponentRegistry,

LibraryScanner

}
from "../dist/index.js";



const registry =
new ComponentRegistry();



const scanner =
new LibraryScanner(
"packages/library/library"
);



scanner.scan(
registry
);



console.log(
registry.list()
);