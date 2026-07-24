import { SymbolRenderer } from "./Symbol";

export class Breaker implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol breaker">
        <rect x="${x}" y="${y}" width="30" height="20"
              fill="none" stroke="black"/>
        <line x1="${x}" y1="${y}"
              x2="${x + 30}" y2="${y + 20}"
              stroke="black"/>
      </g>
    `;
  }
}