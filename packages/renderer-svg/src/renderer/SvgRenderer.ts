import type { PlacedLayout } 
from "@electrodsl/layout";

import type { SvgDocument }
from "../model/SvgDocument.js";

import {
    renderComponent
}
from "./ComponentRenderer.js";


export function renderSvg(
    layout:PlacedLayout
): SvgDocument {


    const elements =
        layout.nodes.map(
            renderComponent
        );


    return {

        width:1000,

        height:800,

        elements

    };

}