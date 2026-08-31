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

      for (const junction of circuit.junctions ?? []) {
        graph.addNode({
          id: junction.id,
          type: "__junction__",
          name: junction.id,
          ports: [{
            id: `${junction.id}:`,
            nodeId: junction.id,
            name: ""
          }],
          properties: {}
        });
      }

      // Connections
      for (const connection of circuit.connections) {
        graph.addEdge({
          id: `${connection.from.component}:${connection.from.pin}->${connection.to.component}:${connection.to.pin}`,
          sourcePortId: `${connection.from.component}:${connection.from.pin}`,
          targetPortId: `${connection.to.component}:${connection.to.pin}`,
          type: "wire",
          metadata: {
            route: connection.route ?? "auto"
          }
        });
      }

      for (const net of circuit.nets ?? []) {
        const [first, ...rest] = net.members;

        if (!first) {
          continue;
        }

        for (const member of rest) {
          graph.addEdge({
            id: `NET:${net.name}:${first.component}:${first.pin}->${member.component}:${member.pin}`,
            sourcePortId: `${first.component}:${first.pin}`,
            targetPortId: `${member.component}:${member.pin}`,
            type: "wire",
            metadata: {
              net: net.name,
              route: "auto"
            }
          });
        }
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
