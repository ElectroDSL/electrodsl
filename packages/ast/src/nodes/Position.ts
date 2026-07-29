export interface Position {

    /**
     * Component X coordinate
     */
    x: number;


    /**
     * Component Y coordinate
     */
    y: number;


    /**
     * Rotation angle in degrees
     *
     * Examples:
     * 0   = normal
     * 90  = clockwise rotation
     * 180 = upside down
     * 270 = counter clockwise
     */
    rotation?: number;


    /**
     * Scaling factor
     *
     * Default = 1
     */
    scale?: number;


    /**
     * Mirror horizontally
     */
    mirrorX?: boolean;


    /**
     * Mirror vertically
     */
    mirrorY?: boolean;

}