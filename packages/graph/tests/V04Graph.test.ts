import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { GraphBuilder } from "../src/index.js";

describe("v0.4 graph", () => {
    it("maps conductors, buses, sheet ports, and module instances", () => {
        const graph = new GraphBuilder().build(parse(`EDSL 0.4 PROJECT "P" {
            MODULE Starter { PORT LINE; PORT LOAD; COMPONENT L1 : IEC-LAMP {} CONNECT LINE -> L1.L; CONNECT L1.N -> LOAD; }
            CIRCUIT "C" { PORT SUPPLY; INSTANCE M1 : Starter;
                CONDUCTOR W1 : SUPPLY -> M1.LINE { size = "1.5 mm2" }
                BUS B1 { phases = "L1,N" M1.LINE; M1.LOAD; }
            }
        }`));
        expect(graph.getNode("SUPPLY")?.type).toBe("__sheet_port__");
        expect(graph.getNode("M1")?.ports).toHaveLength(2);
        expect(graph.getNode("M1/L1")?.type).toBe("IEC-LAMP");
        expect(graph.getEdges().some(edge => edge.id.startsWith("MODULE:M1:"))).toBe(true);
        expect(graph.getEdge("CONDUCTOR:W1")?.metadata?.size).toBe("1.5 mm2");
        expect(graph.getEdges().some(edge => edge.type === "bus")).toBe(true);
    });
});
