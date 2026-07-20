import { parseFile } from "./src/api/parseFile.js";

const result = parseFile(
"../../examples/motor.edsl"
);

console.log(
JSON.stringify(result,null,2)
);