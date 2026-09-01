# ElectroDSL

ElectroDSL is an open, AI-friendly language and TypeScript toolchain for describing, validating, laying out, and rendering electrical schematics.

## ElectroDSL 0.7

Version 0.7 makes project-wide engineering validation mandatory before production outputs are generated and adds CI-readable quality reports.

```powershell
pnpm build
node packages/cli/dist/index.js project check examples/project-v07 --json
node packages/cli/dist/index.js project build examples/project-v07
node packages/cli/dist/index.js project verify examples/project-v07
```

See [the v0.7 quality-gate guide](docs/12-v0.7-quality.md).

## ElectroDSL 0.6

Version 0.6 adds reproducible multi-file production builds, project-wide engineering schedules, and SHA-256 verification of source and generated artifacts.

```powershell
pnpm build
node packages/cli/dist/index.js project build examples/project-v06
node packages/cli/dist/index.js project verify examples/project-v06
```

The example produces SVG drawings plus BOM, conductor, cable, terminal, and cross-reference reports. See [the v0.6 production workflow](docs/11-v0.6-production.md).

## ElectroDSL 0.5

Version 0.5 adds shared editor intelligence and LSP, machine-readable diagnostics, versioned packages with integrity lockfiles, canonical JSON and CSV adapters, RFC governance, and safety-bounded AI generation/review/explanation tools.

```powershell
pnpm build
node packages/cli/dist/index.js diagnose examples/v04-motor-control.edsl --json
node packages/cli/dist/index.js export examples/v04-motor-control.edsl --format netlist-csv
node packages/cli/dist/index.js review examples/v04-motor-control.edsl
```

See [the v0.5 tooling and ecosystem guide](docs/10-v0.5-development.md).

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
