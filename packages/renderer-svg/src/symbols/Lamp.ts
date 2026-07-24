import { SymbolRenderer } from "./Symbol";

export class Lamp implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol lamp">
        <circle cx="${x + 15}" cy="${y + 15}" r="15"
                fill="none" stroke="black"/>
        <line x1="${x + 5}" y1="${y + 5}"
              x2="${x + 25}" y2="${y + 25}"
              stroke="black"/>
        <line x1="${x + 25}" y1="${y + 5}"
              x2="${x + 5}" y2="${y + 25}"
              stroke="black"/>
      </g>
    `;
  }
}