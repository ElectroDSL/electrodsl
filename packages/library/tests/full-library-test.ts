import {

LibraryLoader,

SymbolResolver

}
from "../dist/index.js";



const loader =
new LibraryLoader(
"packages/library/library"
);



const lamp =
loader.load(
"iec/lamp/component.json"
);



console.log(lamp);



const resolver =
new SymbolResolver(
"packages/library/library/iec/lamp"
);



console.log(
resolver.resolve(lamp)
);