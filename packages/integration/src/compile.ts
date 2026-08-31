import { Compiler } from "./Compiler.js";

export function compile(
    source: string,
    startNodeId?: string
): string {

    return new Compiler()
        .compile(
            source,
            startNodeId
        );

}
