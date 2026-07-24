import {
    loadComponent,
    ComponentRegistry
} from "../dist/index.js";


const registry = new ComponentRegistry();


const motor = loadComponent(
    "packages/library/library/iec/motor/component.json"
);

const lamp =
loadComponent(
"packages/library/library/iec/lamp/component.json"
);


registry.register(motor);
registry.register(lamp);


console.log("Available Components:");

console.log(
    registry.list()
);



console.log(
registry.get("IEC-LAMP")
);