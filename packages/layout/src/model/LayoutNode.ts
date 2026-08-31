/**
 * Base interface for every layout node.
 *
 * Specialized nodes such as PowerNode, PortNode,
 * JunctionNode and NetNode extend this interface.
 */
export interface LayoutNode {

    /**
     * Graph node ID.
     */
    nodeId: string;

    /**
     * X position in layout space.
     */
    x: number;

    /**
     * Y position in layout space.
     */
    y: number;

    /**
     * Assigned layout layer.
     */
    layer: number;

}