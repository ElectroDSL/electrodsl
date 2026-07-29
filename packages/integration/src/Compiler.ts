import { parse } from "@electrodsl/parser";
import { GraphBuilder } from "@electrodsl/graph";
import { autoLayout } from "@electrodsl/layout";
import { DiagramBuilder } from "@electrodsl/diagram";
import { renderDiagram } from "@electrodsl/renderer-svg";

import { SymbolProvider } from "@electrodsl/library";


import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Compiler {

    compile(
        source: string,
        startNodeId = "START"
    ): string {

        const libraryRoot = path.resolve(
            __dirname,
            "../../library/library"
        );

        const symbolProvider =
            new SymbolProvider(
                libraryRoot
            );

        const ast =
            parse(source);

        const graph =
            new GraphBuilder()
                .build(ast);

        const layout =
            autoLayout(
                graph,
                startNodeId
            );

        const diagram =
            new DiagramBuilder()
                .build(
                    graph,
                    layout
                );

        return renderDiagram(
            diagram,
            symbolProvider
        );

    }

}