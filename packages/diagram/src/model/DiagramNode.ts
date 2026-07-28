/**
 * A placed component ready for rendering.
 */
export interface DiagramNode {

    /** Unique component identifier */
    id: string;

    /** Symbol identifier (e.g. IEC-MOTOR-3PH) */
    symbol: string;

    /** Drawing position */
    x: number;

    y: number;

    /** Rotation in degrees */
    rotation: number;

    /** Optional user metadata */
    metadata?: Record<string, unknown>;
}