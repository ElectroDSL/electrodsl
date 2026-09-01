import { describe, expect, it } from "vitest";
import { parse } from "@electrodsl/parser";
import { createDefaultAdapterRegistry } from "../src/index.js";

const source = `EDSL 0.5 PROJECT "P" { CIRCUIT "Main" {
    COMPONENT F1 : IEC-FUSE { rating = "10 A" }
    COMPONENT L1 : IEC-LAMP { voltage = "230 V" }
    CONDUCTOR W1 : F1.2 -> L1.L { size = "1.5 mm2" phase = "L1" }
} }`;

describe("adapter registry", () => {
    it("exports canonical JSON through the registry", () => {
        const adapter = createDefaultAdapterRegistry().get("canonical-json")!;
        expect(JSON.parse(adapter.export(parse(source))).project.name).toBe("P");
    });

    it("round-trips components and conductors through CSV", () => {
        const adapter = createDefaultAdapterRegistry().get("netlist-csv")!;
        const csv = adapter.export(parse(source));
        const imported = adapter.import!(csv);
        const document = parse(imported);
        expect(document.project.circuits[0].components).toHaveLength(2);
        expect(document.project.circuits[0].conductors?.[0].id).toBe("W1");
    });

    it("preserves modules, ports, instances, cables, nets, and buses", () => {
        const document = parse(`EDSL 0.5 PROJECT "P" {
            MODULE Load { PORT LINE; PORT RETURN; COMPONENT L1 : IEC-LAMP {} CONNECT LINE -> L1.L; CONNECT L1.N -> RETURN; }
            CIRCUIT "C" { PORT SUPPLY; INSTANCE X1 : Load; CABLE C1 { cores = "4" }
                NET POWER { SUPPLY; X1.LINE; } BUS RETURN { phases = "N,PE" X1.RETURN; SUPPLY; } }
        }`);
        const adapter = createDefaultAdapterRegistry().get("netlist-csv")!;
        const imported = parse(adapter.import!(adapter.export(document)));
        expect(imported.project.modules?.[0].ports).toHaveLength(2);
        expect(imported.project.circuits[0].instances?.[0]).toMatchObject({ id: "X1", module: "Load" });
        expect(imported.project.circuits[0].cables?.[0].id).toBe("C1");
        expect(imported.project.circuits[0].nets?.[0].members).toHaveLength(2);
        expect(imported.project.circuits[0].buses?.[0].members).toHaveLength(2);
    });
});
