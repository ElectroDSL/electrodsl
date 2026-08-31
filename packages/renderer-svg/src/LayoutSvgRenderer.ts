import type {
    PlacedLayout
} from "@electrodsl/layout";

import {
    SvgDocument
} from "./SvgDocument.js";

import {
    renderComponent
} from "./components.js";

import {
    positionedNodeToComponent
} from "./adapters/LayoutComponentAdapter.js";


export function renderPlacedLayoutSVG(
    layout: PlacedLayout
): string {

    const svg =
        new SvgDocument(
            1200,
            800
        );


    layout.nodes

        .map(
            node =>
                renderComponent(
                    positionedNodeToComponent(node),
                    node.x,
                    node.y
                )
        )

        .forEach(
            element =>
                svg.add(
                    "symbols",
                    element
                )
        );


    return svg.render();

}


export function renderLayoutSVG(
    layout: PlacedLayout
): string {

    return renderPlacedLayoutSVG(
        layout
    );

}