/**
 * Node with assigned drawing coordinates.
 */
export interface PositionedNode {

    /**
     * Original component identifier.
     */
    id: string;


    /**
     * Component type.
     */
    type: string;


    /**
     * X coordinate on canvas.
     */
    x: number;


    /**
     * Y coordinate on canvas.
     */
    y: number;


    /**
     * Component drawing size.
     */
    width: number;

    height: number;


    /**
     * Layout layer.
     */
    layer: number;

}