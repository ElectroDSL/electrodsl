export function drawMotor(
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-motor">
    <line x1="${x - 40}" y1="${y}" x2="${x - 26}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x}" cy="${y}" r="26" class="edsl-symbol-shape" />
    <text x="${x}" y="${y + 6}" text-anchor="middle" class="edsl-symbol-text">M</text>
    <line x1="${x + 26}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 40}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 40}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}
