import { SymbolRenderer } from "./Symbol";

export class Transformer implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol transformer">
        <circle cx="${x + 10}" cy="${y + 15}" r="8"
                fill="none" stroke="black"/>
        <circle cx="${x + 30}" cy="${y + 15}" r="8"
                fill="none" stroke="black"/>
      </g>
    `;
  }
}