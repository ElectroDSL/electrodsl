export class SvgDocument {

    private readonly layers = new Map<string, string[]>();

    constructor(
        private readonly width: number,
        private readonly height: number
    ) {

        this.layers.set("background", []);
        this.layers.set("grid", []);
        this.layers.set("wires", []);
        this.layers.set("symbols", []);
        this.layers.set("labels", []);
        this.layers.set("debug", []);

    }

    add(layer: string, svg: string): void {

        const list = this.layers.get(layer);

        if (!list) {
            throw new Error(`Unknown SVG layer: ${layer}`);
        }

        list.push(svg);

    }

    render(): string {

        return `<?xml version="1.0" encoding="UTF-8"?>

<svg
xmlns="http://www.w3.org/2000/svg"
width="${this.width}"
height="${this.height}"
viewBox="0 0 ${this.width} ${this.height}">

${this.style()}

<g id="background">
${this.layers.get("background")!.join("\n")}
</g>

<g id="grid">
${this.layers.get("grid")!.join("\n")}
</g>

<g id="wires">
${this.layers.get("wires")!.join("\n")}
</g>

<g id="symbols">
${this.layers.get("symbols")!.join("\n")}
</g>

<g id="labels">
${this.layers.get("labels")!.join("\n")}
</g>

<g id="debug">
${this.layers.get("debug")!.join("\n")}
</g>

</svg>`;

    }

    private style(): string {

        return `
<style>

.edsl-symbol-line,
.edsl-wire{

fill:none;
stroke:#111;
stroke-width:2;
stroke-linecap:round;
stroke-linejoin:round;

}

.edsl-symbol-shape{

fill:#fff;
stroke:#111;
stroke-width:2;

}

.edsl-terminal{

fill:#111;

}

.edsl-symbol-text{

fill:#111;
font:14px sans-serif;

}

.edsl-component-label{

fill:#111;
font:14px sans-serif;
font-weight:600;

}

.edsl-pin-label{

fill:#555;
font:11px sans-serif;

}

.edsl-pin{

fill:black;

}

</style>
`;

    }

}