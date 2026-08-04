import type { LayoutCell } from "./LayoutCell.js";
import type { PortNode } from "./PortNode.js";
import type { PowerNode } from "./PowerNode.js";

/**
 * Complete layout model used by all layout algorithms.
 */
export interface LayoutGraph {

    /**
     * Layout cells.
     */
    cells: LayoutCell[];

    /**
     * Power symbols.
     */
    powerNodes: PowerNode[];

    /**
     * Component ports.
     */
    portNodes: PortNode[];

}