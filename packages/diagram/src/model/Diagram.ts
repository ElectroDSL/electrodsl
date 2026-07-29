import type { DiagramNode } from "./DiagramNode.js";
import type { DiagramWire } from "./DiagramWire.js";

export interface Diagram {

    /**
     * Components placed on the drawing.
     */
    nodes: DiagramNode[];

    /**
     * Routed wires.
     */
    wires: DiagramWire[];

    /**
     * Free text annotations.
     */
    labels: DiagramLabel[];

    /**
     * Electrical junctions.
     */
    junctions: DiagramJunction[];

    /**
     * Drawing metadata.
     */
    metadata: DiagramMetadata;

    /**
     * Drawing viewport.
     */
    viewport: DiagramViewport;

}

export interface DiagramLabel {

    id: string;

    text: string;

    x: number;

    y: number;

}

export interface DiagramJunction {

    id: string;

    x: number;

    y: number;

}

export interface DiagramMetadata {

    title?: string;

    author?: string;

    revision?: string;

}

export interface DiagramViewport {

    width: number;

    height: number;

}