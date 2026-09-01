export type EngineeringDimension =
    | "dimensionless" | "current" | "voltage" | "power" | "resistance"
    | "capacitance" | "inductance" | "frequency" | "length" | "area";

export interface EngineeringValue {
    source: string;
    value: number;
    unit: string;
    dimension: EngineeringDimension;
    siValue: number;
    siUnit: string;
}

const units: Record<string, { dimension: EngineeringDimension; factor: number; siUnit: string }> = {
    "": { dimension: "dimensionless", factor: 1, siUnit: "" },
    A: { dimension: "current", factor: 1, siUnit: "A" },
    mA: { dimension: "current", factor: 1e-3, siUnit: "A" },
    V: { dimension: "voltage", factor: 1, siUnit: "V" },
    kV: { dimension: "voltage", factor: 1e3, siUnit: "V" },
    W: { dimension: "power", factor: 1, siUnit: "W" },
    kW: { dimension: "power", factor: 1e3, siUnit: "W" },
    ohm: { dimension: "resistance", factor: 1, siUnit: "ohm" },
    kohm: { dimension: "resistance", factor: 1e3, siUnit: "ohm" },
    Mohm: { dimension: "resistance", factor: 1e6, siUnit: "ohm" },
    F: { dimension: "capacitance", factor: 1, siUnit: "F" },
    uF: { dimension: "capacitance", factor: 1e-6, siUnit: "F" },
    nF: { dimension: "capacitance", factor: 1e-9, siUnit: "F" },
    H: { dimension: "inductance", factor: 1, siUnit: "H" },
    mH: { dimension: "inductance", factor: 1e-3, siUnit: "H" },
    Hz: { dimension: "frequency", factor: 1, siUnit: "Hz" },
    kHz: { dimension: "frequency", factor: 1e3, siUnit: "Hz" },
    m: { dimension: "length", factor: 1, siUnit: "m" },
    mm: { dimension: "length", factor: 1e-3, siUnit: "m" },
    "mm2": { dimension: "area", factor: 1e-6, siUnit: "m2" },
    "mm²": { dimension: "area", factor: 1e-6, siUnit: "m2" }
};

export function parseEngineeringValue(source: string): EngineeringValue | undefined {
    const match = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*([A-Za-z0-9²]*)$/.exec(source.trim());
    if (!match) return undefined;
    const value = Number(match[1]);
    const unit = match[2];
    const definition = units[unit];
    if (!definition || !Number.isFinite(value)) return undefined;
    return {
        source,
        value,
        unit,
        dimension: definition.dimension,
        siValue: value * definition.factor,
        siUnit: definition.siUnit
    };
}
