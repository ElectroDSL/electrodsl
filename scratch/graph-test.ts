import { DefaultElectricalGraph } from "../packages/graph/src";
import type { ElectricalNode } from "../packages/graph/src";

const graph = new DefaultElectricalGraph();

const motor: ElectricalNode = {
  id: "M1",
  type: "motor",
  name: "Main Motor",
  ports: [],
  properties: {},
};

graph.addNode(motor);

console.log("Has M1:", graph.hasNode("M1"));
console.log("Node:", graph.getNode("M1"));
console.log("All Nodes:", graph.getNodes());