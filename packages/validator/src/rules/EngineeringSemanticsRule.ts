import type { DocumentNode, PropertyNode } from "@electrodsl/ast";
import { parseEngineeringValue, type EngineeringDimension } from "@electrodsl/engineering";
import type { ValidationError } from "../ValidationError.js";
import type { ValidationRule } from "./ValidationRule.js";

const dimensions: Record<string, EngineeringDimension> = {
    voltage: "voltage", current: "current", rating: "current", power: "power",
    resistance: "resistance", capacitance: "capacitance", inductance: "inductance",
    frequency: "frequency", length: "length", size: "area", cores: "dimensionless"
};
const phases = new Set(["L1", "L2", "L3", "N", "PE", "+", "-", "DC+", "DC-"]);

export class EngineeringSemanticsRule implements ValidationRule {
    validate(document: DocumentNode): ValidationError[] {
        const errors: ValidationError[] = [];
        const modules = new Map((document.project.modules ?? []).map(module => [module.name, module]));

        const supportsEngineering = ["0.4", "0.5", "0.6", "0.7"].includes(document.version);
        if (!supportsEngineering && (document.project.modules?.length ?? 0) > 0) {
            errors.push({ code: "E2200", message: "Module declarations require EDSL 0.4 or later", severity: "error" });
        }

        for (const circuit of [
            ...document.project.circuits,
            ...(document.project.modules ?? []).map(module => module.circuit)
        ]) {
            const usesV04 = (circuit.conductors?.length ?? 0) + (circuit.cables?.length ?? 0) +
                (circuit.buses?.length ?? 0) + (circuit.ports?.length ?? 0) + (circuit.instances?.length ?? 0) > 0;
            if (!supportsEngineering && usesV04) {
                errors.push({ code: "E2200", message: "Engineering declarations require EDSL 0.4 or later", severity: "error" });
            }

            const ids = new Set<string>();
            for (const item of [...(circuit.conductors ?? []), ...(circuit.cables ?? [])]) {
                if (ids.has(item.id)) errors.push({ code: "E2201", message: `Duplicate engineering ID '${item.id}'`, severity: "error" });
                ids.add(item.id);
                this.validateProperties(item.properties, item.id, errors);
            }
            for (const bus of circuit.buses ?? []) {
                this.validateProperties(bus.properties, bus.name, errors);
                const phaseList = bus.properties.find(p => p.name === "phases")?.value.split(",").map(p => p.trim()) ?? [];
                for (const phase of phaseList) if (!phases.has(phase)) errors.push({ code: "E2204", message: `Unknown phase '${phase}' on bus '${bus.name}'`, severity: "error" });
            }
            for (const component of circuit.components) this.validateProperties(component.properties, component.id, errors);
            for (const instance of circuit.instances ?? []) {
                if (!modules.has(instance.module)) errors.push({ code: "E2205", message: `Unknown module '${instance.module}' on instance '${instance.id}'`, severity: "error" });
            }
        }
        return errors;
    }

    private validateProperties(properties: PropertyNode[], owner: string, errors: ValidationError[]): void {
        for (const property of properties) {
            const expected = dimensions[property.name];
            if (expected) {
                const value = parseEngineeringValue(property.value);
                if (!value || value.dimension !== expected) errors.push({
                    code: "E2202", message: `Property '${property.name}' on '${owner}' requires a ${expected} engineering value`, severity: "error"
                });
            }
            if (property.name === "designation" && !/^(?:=[A-Za-z0-9_]+)?(?:\+[A-Za-z0-9_]+)?-[A-Za-z][A-Za-z0-9_]*$/.test(property.value)) {
                errors.push({ code: "E2203", message: `Invalid reference designation '${property.value}' on '${owner}'`, severity: "error" });
            }
        }
    }
}
