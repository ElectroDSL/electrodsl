# ElectroDSL

ElectroDSL is an open, AI-friendly language and TypeScript toolchain for describing, validating, laying out, and rendering electrical schematics.

## ElectroDSL 0.5 development preview

The first `0.5.0-dev.1` milestone adds shared editor intelligence, machine-readable diagnostics, versioned package manifests and resolution, an RFC governance process, and valid AI-schema source generation.

```powershell
pnpm build
node packages/cli/dist/index.js diagnose examples/v04-motor-control.edsl --json
```

See [the v0.5 development guide](docs/10-v0.5-development.md). Version 0.5 is in progress; the stable engineering-language release remains 0.4.

## ElectroDSL 0.4

Version 0.4 adds engineering semantics: typed SI values, conductors, cables, multi-phase buses, protective earth, reusable modules, cross-sheet ports, and structured reference designations. The canonical JSON IR preserves source values and includes normalized SI values.

```powershell
pnpm build
node packages/cli/dist/index.js check examples/v04-motor-control.edsl
node packages/cli/dist/index.js format examples/v04-motor-control.edsl --check
node packages/cli/dist/index.js export examples/v04-motor-control.edsl --format json
node packages/cli/dist/index.js build examples/v04-motor-control.edsl
```

See [the 0.4 language specification](docs/09-v0.4-specification.md), [canonical IR schema](schemas/electrodsl-ir-0.4.schema.json), and [conformance suite](conformance/README.md).
