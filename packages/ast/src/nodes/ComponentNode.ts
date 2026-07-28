import { AstNode } from "./AstNode.js";
import { NodeKind } from "../enums/NodeKind.js";
import { PropertyNode } from "./PropertyNode.js";
import { PinNode } from "./PinNode.js";


export interface ComponentNode extends AstNode {

    kind: NodeKind.Component;

    id: string;

    componentType: string;

    /**
     * Normalized component type for consumers that use the common `type`
     * field name. `componentType` remains the backward-compatible field.
     */
    type: string;

    properties: PropertyNode[];

    pins: PinNode[];


    /**
     * Position assigned by layout engine
     */
    position?: {

        x: number;

        y: number;

    };

}
