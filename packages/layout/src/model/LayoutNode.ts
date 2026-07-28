import type { ElectricalNode } from "@electrodsl/graph";


/**
 * Electrical component with calculated position.
 */
export interface LayoutNode {


    /**
     * Original graph component.
     */
    node: ElectricalNode;



    /**
     * X coordinate on drawing canvas.
     */
    x: number;



    /**
     * Y coordinate on drawing canvas.
     */
    y: number;



    /**
     * Layout layer.
     *
     * Example:
     * Layer 0 = Supply
     * Layer 1 = Protection
     * Layer 2 = Load
     */
    layer: number;

}