import type { LayoutNode } from "./LayoutNode.js";

/**
 * Represents a power symbol in the layout.
 */
export interface PowerNode extends LayoutNode {

    /**
     * Symbol name.
     * Examples:
     * VCC
     * GND
     * +5V
     */
    symbol: string;

}