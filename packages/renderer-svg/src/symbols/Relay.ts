import { SymbolRenderer } from "./Symbol";

export class Relay implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol relay">
        <rect x="${x}" y="${y}" width="40" height="20"
              fill="none" stroke="black"/>
        <text x="${x + 20}" y="${y + 14}"
              text-anchor="middle"
              font-size="8">K</text>
      </g>
    `;
  }
}