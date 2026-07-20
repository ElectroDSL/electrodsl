import { parse } from "./api/parse.js";


const ast = parse(`
EDSL 0.1

PROJECT "Demo" {

}
`);


console.log(
    JSON.stringify(ast, null, 2)
);import { parse } from "./api/parse.js";


const source = `

EDSL 0.1

PROJECT "Demo" {

}

`;


const result = parse(source);


console.log(
    JSON.stringify(result, null, 2)
);