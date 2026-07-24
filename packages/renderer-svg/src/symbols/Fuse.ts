import { SymbolRenderer } from "./Symbol";

export class Fuse implements SymbolRenderer {
  render(x: number, y: number): string {
    return `
      <g class="symbol fuse">
        <rect x="${x}" y="${y + 6}" width="30" height="8"
              fill="none" stroke="black"/>
      </g>
    `;
  }
}