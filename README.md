# ElectroDSL

ElectroDSL is an open, AI-friendly language and TypeScript toolchain for describing, validating, laying out, and rendering electrical schematics.

## ElectroDSL 0.2

Version 0.2 supports component libraries with exact terminal coordinates, named net membership, explicit junctions, route preferences, semantic validation, obstacle-aware orthogonal wire routing, and SVG output.

```powershell
pnpm build
node packages/cli/dist/index.js check examples/v02-panel.edsl
node packages/cli/dist/index.js build examples/v02-panel.edsl
```

See [the 0.2 language guide](docs/07-v0.2.md) and [examples/v02-panel.edsl](examples/v02-panel.edsl).
