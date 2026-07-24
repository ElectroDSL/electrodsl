import {
    loadComponent,
    SymbolResolver
}
from "../dist/index.js";



const lamp =
loadComponent(
"packages/library/library/iec/lamp/component.json"
);



const resolver =
new SymbolResolver(

"packages/library/library/iec/lamp"

);



const symbol =
resolver.resolve(lamp);



console.log(
"Symbol Path:"
);


console.log(symbol);