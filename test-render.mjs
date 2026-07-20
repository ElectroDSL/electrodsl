import { parseFile } from "./packages/parser/dist/index.js";
import { renderSVG } from "./packages/renderer-svg/dist/index.js";
import fs from "node:fs";

const doc = parseFile("examples/connection.edsl");

const svg = renderSVG(doc);

fs.writeFileSync("motor.svg", svg);

console.log("SVG written.");