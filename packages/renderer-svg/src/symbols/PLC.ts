import { SymbolRenderer } from "./Symbol";

export class PLC implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol plc">
        <rect x="${x}" y="${y}" width="60" height="40"
              fill="none" stroke="black"/>
        <text x="${x + 30}" y="${y + 22}"
              text-anchor="middle"
              font-size="10">PLC</text>
      </g>
    `;
  }
}