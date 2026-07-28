import {
  type DocumentNode,
  type ComponentNode,
} from "@electrodsl/ast";

import {
  DefaultElectricalGraph,
} from "../model";

/**
 * Converts an ElectroDSL AST into an ElectricalGraph.
 */
export class GraphBuilder {

  build(document: DocumentNode): DefaultElectricalGraph {

    const graph = new DefaultElectricalGraph();

    for (const circuit of document.project.circuits) {

      // Components
      for (const component of circuit.components) {
        graph.addNode(this.createNode(component));
      }

      // Connections
      for (const connection of circuit.connections) {
        graph.addEdge({
          id: `${connection.from.component}:${connection.from.pin}->${connection.to.component}:${connection.to.pin}`,
          sourcePortId: `${connection.from.component}:${connection.from.pin}`,
          targetPortId: `${connection.to.component}:${connection.to.pin}`,
          type: "wire",
        });
      }

    }

    return graph;
  }

  /**
   * Converts an AST ComponentNode into an ElectricalNode.
   */
  private createNode(component: ComponentNode) {

    return {
      id: component.id,

      type: component.componentType,

      name: component.id,

      ports: component.pins.map(pin => ({
        id: `${component.id}:${pin.name}`,
        nodeId: component.id,
        name: pin.name,
      })),

      properties: Object.fromEntries(
        component.properties.map(property => [
          property.name,
          property.value,
        ])
      ),

      metadata: {
        position: component.position,
      },
    };
  }
}