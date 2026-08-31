import type { LayoutNode } from "./LayoutNode.js";
import { PortDirection } from "./PortDirection.js";

/**
 * Represents a connection point on a component.
 */
export interface PortNode extends LayoutNode {

    /**
     * Component owning this port.
     */
    componentId: string;

    /**
     * Port identifier.
     */
    portId: string;

    /**
     * Port orientation.
     */
    direction: PortDirection;

}