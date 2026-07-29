import { Compiler } from "./Compiler.js";

export function compile(
    source: string,
    startNodeId = "START"
): string {

    return new Compiler()
        .compile(
            source,
            startNodeId
        );

}