import { readFileSync } from "node:fs";
import { parse } from "./parse.js";


export function parseFile(path: string) {

    const source = readFileSync(
        path,
        "utf-8"
    );

    return parse(source);

}