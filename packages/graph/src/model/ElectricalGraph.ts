import type { ElectricalEdge } from "./ElectricalEdge";
import type { ElectricalNode } from "./ElectricalNode";

/**
 * Public contract for an electrical graph.
 */
export interface ElectricalGraph {
  // -----------------------------
  // Node Management
  // -----------------------------

  addNode(node: ElectricalNode): void;

  getNode(id: string): ElectricalNode | undefined;

  hasNode(id: string): boolean;

  removeNode(id: string): boolean;

  getNodes(): readonly ElectricalNode[];

  // -----------------------------
  // Edge Management
  // -----------------------------

  addEdge(edge: ElectricalEdge): void;

  getEdge(id: string): ElectricalEdge | undefined;

  hasEdge(id: string): boolean;

  removeEdge(id: string): boolean;

  getEdges(): readonly ElectricalEdge[];
}