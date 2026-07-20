export function drawResistor(
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-resistor">
    <line x1="${x - 40}" y1="${y}" x2="${x - 24}" y2="${y}" class="edsl-symbol-line" />
    <rect x="${x - 24}" y="${y - 10}" width="48" height="20" class="edsl-symbol-shape" />
    <line x1="${x + 24}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 40}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 40}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}
