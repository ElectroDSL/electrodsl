import { SymbolRenderer } from "./Symbol";

export class PowerSupply implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol power-supply">
        <rect x="${x}" y="${y}" width="40" height="20"
              fill="none" stroke="black"/>
        <text x="${x + 20}" y="${y + 14}"
              text-anchor="middle"
              font-size="8">PS</text>
      </g>
    `;
  }
}