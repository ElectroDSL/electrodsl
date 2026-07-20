import { PropertyNode } from "./PropertyNode";
import { PinNode } from "./PinNode";

export interface ComponentNode {

    type: "Component";

    id: string;

    componentType: string;

    properties: PropertyNode[];

    pins: PinNode[];

}