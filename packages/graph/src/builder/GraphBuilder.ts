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
    const modules = new Map((document.project.modules ?? []).map(module => [module.name, module]));

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

      for (const port of circuit.ports ?? []) {
        if (!graph.getNode(port.id)) graph.addNode({
          id: port.id,
          type: "__sheet_port__",
          name: port.id,
          ports: [{ id: `${port.id}:`, nodeId: port.id, name: "" }],
          properties: {}
        });
      }

      for (const instance of circuit.instances ?? []) {
        const module = modules.get(instance.module);
        graph.addNode({
          id: instance.id,
          type: `__module__:${instance.module}`,
          name: instance.id,
          ports: (module?.ports ?? []).map(port => ({
            id: `${instance.id}:${port.id}`, nodeId: instance.id, name: port.id
          })),
          properties: { module: instance.module }
        });

        if (module) {
          const modulePorts = new Set(module.ports.map(port => port.id));
          const mapEndpoint = (value: { component: string; pin: string }) => modulePorts.has(value.component)
            ? `${instance.id}:${value.component}`
            : `${instance.id}/${value.component}:${value.pin}`;

          for (const component of module.circuit.components) {
            graph.addNode(this.createNode({ ...component, id: `${instance.id}/${component.id}` }));
          }
          for (const junction of module.circuit.junctions ?? []) {
            const id = `${instance.id}/${junction.id}`;
            graph.addNode({ id, type: "__junction__", name: id,
              ports: [{ id: `${id}:`, nodeId: id, name: "" }], properties: {} });
          }
          for (const connection of module.circuit.connections) {
            graph.addEdge({ id: `MODULE:${instance.id}:${mapEndpoint(connection.from)}->${mapEndpoint(connection.to)}`,
              sourcePortId: mapEndpoint(connection.from), targetPortId: mapEndpoint(connection.to), type: "wire",
              metadata: { route: connection.route ?? "auto", module: instance.module } });
          }
          for (const conductor of module.circuit.conductors ?? []) {
            graph.addEdge({ id: `MODULE:${instance.id}:CONDUCTOR:${conductor.id}`,
              sourcePortId: mapEndpoint(conductor.from), targetPortId: mapEndpoint(conductor.to), type: "conductor",
              metadata: { module: instance.module, ...Object.fromEntries(conductor.properties.map(p => [p.name, p.value])) } });
          }
          for (const net of [...(module.circuit.nets ?? []), ...(module.circuit.buses ?? [])]) {
            const [first, ...rest] = net.members;
            if (!first) continue;
            for (const member of rest) graph.addEdge({
              id: `MODULE:${instance.id}:${net.name}:${mapEndpoint(first)}->${mapEndpoint(member)}`,
              sourcePortId: mapEndpoint(first), targetPortId: mapEndpoint(member), type: "wire",
              metadata: { module: instance.module, net: net.name, route: "auto" }
            });
          }
        }
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

      for (const conductor of circuit.conductors ?? []) {
        graph.addEdge({
          id: `CONDUCTOR:${conductor.id}`,
          sourcePortId: `${conductor.from.component}:${conductor.from.pin}`,
          targetPortId: `${conductor.to.component}:${conductor.to.pin}`,
          type: "conductor",
          metadata: Object.fromEntries(conductor.properties.map(property => [property.name, property.value]))
        });
      }

      for (const bus of circuit.buses ?? []) {
        const [first, ...rest] = bus.members;
        if (!first) continue;
        for (const member of rest) graph.addEdge({
          id: `BUS:${bus.name}:${first.component}:${first.pin}->${member.component}:${member.pin}`,
          sourcePortId: `${first.component}:${first.pin}`,
          targetPortId: `${member.component}:${member.pin}`,
          type: "bus",
          metadata: {
            bus: bus.name,
            ...Object.fromEntries(bus.properties.map(property => [property.name, property.value]))
          }
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
