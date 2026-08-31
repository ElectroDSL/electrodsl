import type {
    PlacedLayout
} from "@electrodsl/layout";

import type {
    SvgDocument
} from "../model/SvgDocument.js";

import {
    renderComponent
} from "./ComponentRenderer.js";


export function renderSvg(
    layout: PlacedLayout
): SvgDocument {

    const elements =
        layout.nodes.map(
            renderComponent
        );


    const symbols =
        new Map<string, string>();


    return {

        width: 1000,

        height: 800,

        elements,

        symbols,

        addSymbol(
            id: string,
            content: string
        ): void {

            symbols.set(
                id,
                content
            );

        }

    };

}