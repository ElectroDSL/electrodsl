export function drawContactor(
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-contactor">
    <line x1="${x - 40}" y1="${y}" x2="${x - 20}" y2="${y}" class="edsl-symbol-line" />
    <rect x="${x - 20}" y="${y - 24}" width="40" height="48" rx="3" class="edsl-symbol-shape" />
    <line x1="${x - 12}" y1="${y - 12}" x2="${x + 12}" y2="${y + 12}" class="edsl-symbol-line" />
    <line x1="${x + 20}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 40}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 40}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}
