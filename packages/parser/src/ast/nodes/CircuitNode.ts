import { ComponentNode } from "./ComponentNode";
import { ConnectionNode } from "./ConnectionNode";

export interface CircuitNode {
  type: "Circuit";
  name: string;

  components: ComponentNode[];
  connections: ConnectionNode[];
}