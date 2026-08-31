# ElectroDSL

ElectroDSL is an open, AI-friendly language and TypeScript toolchain for describing, validating, laying out, and rendering electrical schematics.

## ElectroDSL 0.3

Version 0.3 makes ElectroDSL usable as an open interchange language. It adds a normative specification, canonical JSON IR, deterministic formatter, structured diagnostics, and executable conformance suite. It retains the electrically meaningful nets, validated terminals, junctions, and collision-aware SVG routing from 0.2.

```powershell
pnpm build
node packages/cli/dist/index.js check examples/v03-control.edsl
node packages/cli/dist/index.js format examples/v03-control.edsl --check
node packages/cli/dist/index.js export examples/v03-control.edsl --format json
node packages/cli/dist/index.js build examples/v03-control.edsl
```

See [the 0.3 language specification](docs/08-v0.3-specification.md), [canonical IR schema](schemas/electrodsl-ir-0.3.schema.json), and [conformance suite](conformance/README.md).
