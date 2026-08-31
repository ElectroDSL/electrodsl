import { describe, expect, test } from "vitest";

import {
    LibraryLoader
} from "../src/loader/LibraryLoader.js";


describe(
    "Power Cell library component",
    () => {


test(
"loads IEC power cell",
async()=>{


const loader =
new LibraryLoader();


const component =
await loader.loadComponent(
"iec.power-cell"
);


expect(component.id)
.toBe(
"iec.power-cell"
);


expect(component.pins.length)
.toBe(2);


});


});