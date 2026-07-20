import { PropertyNode } from "./PropertyNode";

export interface ComponentNode {
  type: "Component";

  id: string;

  componentType: string;

  properties: PropertyNode[];
}