import { SymbolRenderer } from "./Symbol";

export class Terminal implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol terminal">
        <circle cx="${x + 8}" cy="${y + 8}" r="4"
                fill="none" stroke="black"/>
      </g>
    `;
  }
}