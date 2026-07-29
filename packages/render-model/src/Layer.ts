import type { ComponentNode } from "./ComponentNode";
import type { WireNode } from "./WireNode";
import type { TextNode } from "./TextNode";

export interface Layer {
  name: string;

  components: ComponentNode[];

  wires: WireNode[];

  texts: TextNode[];
}