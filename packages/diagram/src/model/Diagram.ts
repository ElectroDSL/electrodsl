import type { DiagramNode } from "./DiagramNode.js";
import type { DiagramWire } from "./DiagramWire.js";

/**
 * A complete electrical drawing ready for rendering.
 */
export interface Diagram {

    nodes: DiagramNode[];

    wires: DiagramWire[];

}