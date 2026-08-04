export interface PowerNode {
    /**
     * Graph node ID.
     */
    nodeId: string;

    /**
     * Symbol type (VCC, GND, etc.)
     */
    symbol: string;

    /**
     * Calculated position.
     */
    x: number;
    y: number;

    /**
     * Assigned layout layer.
     */
    layer: number;
}