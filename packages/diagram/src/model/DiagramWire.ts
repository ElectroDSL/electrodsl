/**
 * A wire connecting two diagram nodes.
 */
export interface DiagramWire {

    id: string;

    from: string;

    to: string;

    /** Optional bend points for routed wires */
    points?: Array<{
        x: number;
        y: number;
    }>;
}