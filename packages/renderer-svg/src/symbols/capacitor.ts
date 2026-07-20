export function drawCapacitor(
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-capacitor">
    <line x1="${x - 40}" y1="${y}" x2="${x - 8}" y2="${y}" class="edsl-symbol-line" />
    <line x1="${x - 8}" y1="${y - 22}" x2="${x - 8}" y2="${y + 22}" class="edsl-symbol-line" />
    <line x1="${x + 8}" y1="${y - 22}" x2="${x + 8}" y2="${y + 22}" class="edsl-symbol-line" />
    <line x1="${x + 8}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 40}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 40}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}
