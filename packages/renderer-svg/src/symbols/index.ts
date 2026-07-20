import { drawCapacitor } from "./capacitor.js";
import { drawContactor } from "./contactor.js";
import { drawGeneric } from "./generic.js";
import { drawMotor } from "./motor.js";
import { drawResistor } from "./resistor.js";

export function drawSymbol(
    componentType: string,
    x: number,
    y: number
): string {

    switch (componentType.toLowerCase()) {

        case "resistor":
            return drawResistor(x, y);

        case "capacitor":
            return drawCapacitor(x, y);

        case "motor":
            return drawMotor(x, y);

        case "contactor":
            return drawContactor(x, y);

        case "switch":
            return drawSwitch(x, y);

        default:
            return drawGeneric(componentType, x, y);

    }

}

function drawSwitch(
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-switch">
    <line x1="${x - 40}" y1="${y}" x2="${x - 12}" y2="${y}" class="edsl-symbol-line" />
    <line x1="${x - 12}" y1="${y}" x2="${x + 18}" y2="${y - 18}" class="edsl-symbol-line" />
    <line x1="${x + 22}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 12}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 22}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}
