import { describe, expect, test } from "vitest";
import { parse } from "../src";

describe("Component Parsing", () => {
    test("parses one component", () => {

        const ast = parse(`
EDSL 0.1

PROJECT "Motor" {

    CIRCUIT "Power" {

        COMPONENT Q1: Contactor {

        }

    }

}
`);

        expect(ast.project.circuits).toHaveLength(1);
        expect(ast.project.circuits[0].components).toHaveLength(1);
        expect(ast.project.circuits[0].components[0].id).toBe("Q1");
        expect(ast.project.circuits[0].components[0].componentType).toBe("Contactor");
    });
});