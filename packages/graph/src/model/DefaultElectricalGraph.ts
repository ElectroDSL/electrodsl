import type { ElectricalEdge } from "./ElectricalEdge";
import type { ElectricalGraph } from "./ElectricalGraph";
import type { ElectricalNode } from "./ElectricalNode";

/**
 * Default implementation of ElectricalGraph.
 */
export class DefaultElectricalGraph implements ElectricalGraph {
  private readonly nodes = new Map<string, ElectricalNode>();

  private readonly edges = new Map<string, ElectricalEdge>();

  // ===================================================
  // Node Management
  // ===================================================

  addNode(node: ElectricalNode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node '${node.id}' already exists.`);
    }

    this.nodes.set(node.id, node);
  }

  getNode(id: string): ElectricalNode | undefined {
    return this.nodes.get(id);
  }

  hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  removeNode(id: string): boolean {
    return this.nodes.delete(id);
  }

  getNodes(): readonly ElectricalNode[] {
    return [...this.nodes.values()];
  }

  // ===================================================
  // Edge Management
  // ===================================================

  addEdge(edge: ElectricalEdge): void {
    if (this.edges.has(edge.id)) {
      throw new Error(`Edge '${edge.id}' already exists.`);
    }

    this.edges.set(edge.id, edge);
  }

  getEdge(id: string): ElectricalEdge | undefined {
    return this.edges.get(id);
  }

  hasEdge(id: string): boolean {
    return this.edges.has(id);
  }

  removeEdge(id: string): boolean {
    return this.edges.delete(id);
  }

  getEdges(): readonly ElectricalEdge[] {
    return [...this.edges.values()];
  }
}