export function drawGeneric(
    componentType: string,
    x: number,
    y: number
): string {

    return `
<g class="edsl-symbol edsl-generic">
    <line x1="${x - 40}" y1="${y}" x2="${x - 30}" y2="${y}" class="edsl-symbol-line" />
    <rect x="${x - 30}" y="${y - 20}" width="60" height="40" class="edsl-symbol-shape" />
    <text x="${x}" y="${y + 5}" text-anchor="middle" class="edsl-symbol-text">${escapeText(componentType)}</text>
    <line x1="${x + 30}" y1="${y}" x2="${x + 40}" y2="${y}" class="edsl-symbol-line" />
    <circle cx="${x - 40}" cy="${y}" r="3" class="edsl-terminal" />
    <circle cx="${x + 40}" cy="${y}" r="3" class="edsl-terminal" />
</g>`;

}

function escapeText(value: string): string {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

}
