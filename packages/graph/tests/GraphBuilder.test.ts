import { describe, expect, it } from "vitest";

import { NodeKind } from "@electrodsl/ast";

import { GraphBuilder } from "../src";

describe("GraphBuilder", () => {

  it("should convert components into graph nodes", () => {

    const builder = new GraphBuilder();

    const document = {
      kind: NodeKind.Document,
      version: "1.0",

      project: {
        kind: NodeKind.Project,
        name: "Demo",

        circuits: [
          {
            kind: NodeKind.Circuit,
            name: "Main",

            components: [
              {
                kind: NodeKind.Component,
                id: "M1",
                componentType: "motor",
                type: "motor",
                properties: [],
                pins: [],
              },
            ],

            connections: [],
          },
        ],
      },
    };

    const graph = builder.build(document as any);

    expect(graph.getNodes()).toHaveLength(1);
    expect(graph.getNode("M1")).toBeDefined();
  });

  it("should convert connections into graph edges", () => {

    const builder = new GraphBuilder();

    const document = {
      kind: NodeKind.Document,
      version: "1.0",

      project: {
        kind: NodeKind.Project,
        name: "Demo",

        circuits: [
          {
            kind: NodeKind.Circuit,
            name: "Main",

            components: [
              {
                kind: NodeKind.Component,
                id: "Q1",
                componentType: "breaker",
                type: "breaker",
                properties: [],
                pins: [],
              },
              {
                kind: NodeKind.Component,
                id: "M1",
                componentType: "motor",
                type: "motor",
                properties: [],
                pins: [],
              },
            ],

            connections: [
              {
                kind: NodeKind.Connection,
                from: {
                  component: "Q1",
                  pin: "T1",
                },
                to: {
                  component: "M1",
                  pin: "L1",
                },
              },
            ],
          },
        ],
      },
    };

    const graph = builder.build(document as any);

    expect(graph.getEdges()).toHaveLength(1);

    expect(graph.getEdges()[0].sourcePortId).toBe("Q1:T1");
    expect(graph.getEdges()[0].targetPortId).toBe("M1:L1");
  });

});