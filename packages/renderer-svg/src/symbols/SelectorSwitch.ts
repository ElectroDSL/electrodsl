import { SymbolRenderer } from "./Symbol";

export class SelectorSwitch implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol selector-switch">
        <circle cx="${x + 15}" cy="${y + 15}" r="12"
                fill="none" stroke="black"/>
        <line x1="${x + 15}" y1="${y + 15}"
              x2="${x + 24}" y2="${y + 6}"
              stroke="black"/>
      </g>
    `;
  }
}