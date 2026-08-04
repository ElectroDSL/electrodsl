export interface LayoutCell {
    /**
     * Unique cell identifier.
     */
    id: string;

    /**
     * Graph node assigned to this cell.
     */
    nodeId: string;

    /**
     * Grid position.
     */
    row: number;
    column: number;

    /**
     * Pixel position.
     */
    x: number;
    y: number;

    /**
     * Cell size.
     */
    width: number;
    height: number;
}