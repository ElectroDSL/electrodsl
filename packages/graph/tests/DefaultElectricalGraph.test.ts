import { describe, expect, it } from "vitest";

import {
  DefaultElectricalGraph,
  type ElectricalNode,
  type ElectricalEdge,
} from "../src";

describe("DefaultElectricalGraph", () => {
  it("should create an empty graph", () => {
    const graph = new DefaultElectricalGraph();

    expect(graph.getNodes()).toHaveLength(0);
    expect(graph.getEdges()).toHaveLength(0);
  });

  it("should add a node", () => {
    const graph = new DefaultElectricalGraph();

    const node: ElectricalNode = {
      id: "M1",
      type: "motor",
      name: "Main Motor",
      ports: [],
      properties: {},
    };

    graph.addNode(node);

    expect(graph.hasNode("M1")).toBe(true);
    expect(graph.getNode("M1")).toEqual(node);
    expect(graph.getNodes()).toHaveLength(1);
  });

  it("should remove a node", () => {
    const graph = new DefaultElectricalGraph();

    const node: ElectricalNode = {
      id: "M1",
      type: "motor",
      ports: [],
      properties: {},
    };

    graph.addNode(node);

    expect(graph.removeNode("M1")).toBe(true);
    expect(graph.hasNode("M1")).toBe(false);
    expect(graph.getNodes()).toHaveLength(0);
  });

  it("should reject duplicate node IDs", () => {
    const graph = new DefaultElectricalGraph();

    const node: ElectricalNode = {
      id: "M1",
      type: "motor",
      ports: [],
      properties: {},
    };

    graph.addNode(node);

    expect(() => graph.addNode(node)).toThrow();
  });

  it("should add an edge", () => {
    const graph = new DefaultElectricalGraph();

    const edge: ElectricalEdge = {
      id: "E1",
      sourcePortId: "Q1:T1",
      targetPortId: "M1:L1",
      type: "power",
    };

    graph.addEdge(edge);

    expect(graph.hasEdge("E1")).toBe(true);
    expect(graph.getEdge("E1")).toEqual(edge);
    expect(graph.getEdges()).toHaveLength(1);
  });

  it("should reject duplicate edge IDs", () => {
    const graph = new DefaultElectricalGraph();

    const edge: ElectricalEdge = {
      id: "E1",
      sourcePortId: "Q1:T1",
      targetPortId: "M1:L1",
      type: "power",
    };

    graph.addEdge(edge);

    expect(() => graph.addEdge(edge)).toThrow();
  });
});