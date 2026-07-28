import type { DocumentNode } from "@electrodsl/ast";
import type { LayoutResult } from "@electrodsl/layout";

import { renderSVG } from "./renderer.js";

/**
 * Future renderer entry point.
 *
 * For now this simply delegates to the existing renderer.
 * In the next step it will render using the layout coordinates.
 */
export function renderLayoutSVG(
    document: DocumentNode,
    layout: LayoutResult[]
): string {

    // Layout is intentionally unused for now.
    // This keeps the API stable while we migrate
    // the renderer away from fixed coordinates.

    void layout;

    return renderSVG(document);

}