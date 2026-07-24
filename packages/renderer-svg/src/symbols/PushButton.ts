import { SymbolRenderer } from "./Symbol";

export class PushButton implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol pushbutton">
        <circle cx="${x + 15}" cy="${y + 15}" r="12"
                fill="none" stroke="black"/>
        <text x="${x + 15}" y="${y + 19}"
              text-anchor="middle"
              font-size="8">PB</text>
      </g>
    `;
  }
}