import { NodeKind } from "../enums/NodeKind.js";
import { AstNode } from "./AstNode.js";


export interface PinNode extends AstNode {

    kind: NodeKind.Pin;


    /**
     * Terminal identifier
     * Example: L, N, U, V, W
     */
    name: string;


    /**
     * Visual side of symbol
     */
    side?:
    "left" |
    "right" |
    "top" |
    "bottom";


    /**
     * Electrical direction
     */
    direction?:
    "input" |
    "output" |
    "bidirectional" |
    "power" |
    "passive";


    /**
     * Position relative to symbol origin
     */
    position?: {

        x: number;

        y: number;

    };

}