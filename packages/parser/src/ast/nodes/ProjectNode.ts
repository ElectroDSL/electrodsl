import { CircuitNode } from "./CircuitNode";

export interface ProjectNode {
  type: "Project";
  name: string;
  circuits: CircuitNode[];
}