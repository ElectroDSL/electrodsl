# Changelog

All notable changes to ElectroDSL will be documented in this file.

The format follows Keep a Changelog.

---

## [0.8.0] - 2026-09-01

### Added

- Electrical integrity validation for self-loops and duplicate paths
- Cable declaration and core-allocation checks
- Isolated-component and dangling cross-sheet-port warnings
- Deterministic project connectivity analysis
- Verified `connectivity.json` production artifact
- Versioned 0.8 project, artifact, quality, and connectivity schemas

### Changed

- CLI validation now reports warnings without returning a failing exit code
- Project quality gates apply the v0.8 integrity rules before generation

## [0.7.0] - 2026-09-01

### Added

- Mandatory project-wide engineering quality gate before production builds
- Human-readable and JSON `project check` command for local development and CI
- Project identity, language consistency, and duplicate circuit/module diagnostics
- Versioned quality report included in verified build artifacts
- Project, artifact, and quality JSON schemas for 0.7

### Changed

- Production builds now fail before writing outputs when validation errors exist
- Language and engineering validation recognize ElectroDSL 0.7

## [0.6.0] - 2026-09-01

### Added

- Safe multi-file project manifests and SVG production builds
- Project-wide BOM, conductor, cable, terminal, and cross-reference reports in JSON and CSV
- Deterministic SHA-256 artifact manifests and build verification
- `project build`, `project verify`, and `report` CLI workflows
- ElectroDSL 0.6 schemas, conformance fixture, and complete production example

### Changed

- Language and engineering validation now recognize ElectroDSL 0.6

## [0.5.0] - 2026-09-01

### Added

- Editor-neutral language service with diagnostics, formatting, completions, and hover information
- JSON diagnostics CLI command for editor and CI integrations
- Versioned package manifest model, validation, schema, and deterministic resolver
- Public RFC governance process and proposal template
- ElectroDSL 0.5 conformance fixture
- Standard stdio Language Server Protocol transport
- VS Code language and syntax-highlighting scaffold
- Transitive dependency lockfiles with SHA-256 integrity verification
- Adapter registry with canonical JSON and round-trippable CSV netlists
- AI generation prompts, validation, explanations, and conservative optimization hints
- CLI commands for LSP, import/export, AI prompts, reviews, and explanations

### Fixed

- AI schema generator now emits valid, deterministic, parseable ElectroDSL 0.5
- Engineering constructs correctly inherit into language version 0.5

---

## [0.4.0] - 2026-08-31

### Added

- Typed engineering-value parser with SI normalization
- Conductors with size, phase, cable, and arbitrary engineering properties
- Multi-core cable declarations
- Multi-phase bus declarations including protective earth
- Reusable modules, public ports, and validated instances
- Module expansion into scoped electrical graph nodes and edges
- Cross-sheet electrical continuity through shared ports
- IEC 81346-style function, location, and product reference designations
- Canonical IR 0.4 and JSON Schema for all engineering constructs
- Normative 0.4 specification, conformance fixture, and motor-control example

### Changed

- All workspace packages are versioned as 0.4.0
- Formatter, validator, graph, renderer, and JSON exporter support v0.4 constructs
- Optional semicolons are accepted after properties

---

## [0.3.0] - 2026-08-31

### Added

- Normative ElectroDSL 0.3 language specification and EBNF grammar
- Canonical, renderer-independent JSON IR with a published JSON Schema
- Explicit separation of electrical semantics from presentation preferences
- Deterministic, idempotent reference formatter
- CLI `format`, formatter check/write modes, and canonical JSON export
- Structured parser diagnostics with stable codes and source locations
- Executable accepted/rejected conformance fixtures
- Reference 0.3 control-circuit example

### Changed

- All workspace packages are versioned as 0.3.0
- Language validation accepts 0.3 while preserving 0.1 and 0.2 compatibility

---

## [0.2.0] - 2026-08-31

### Added

- Named nets with explicit electrical membership
- Explicit junction declarations and rendered junction dots
- Connection route preferences: `auto`, `above`, and `below`
- Component, terminal, version, net, junction, and route validation
- Obstacle-aware orthogonal SVG wire routing
- Net labels in generated SVG diagrams
- Numeric terminal parsing and strict syntax-error reporting
- Complete 0.2 example and regression coverage

### Changed

- CLI build and export now validate input before rendering
- Loaded symbols now expose terminal coordinates to the routing pipeline
- All workspace packages are versioned as 0.2.0

---

## [0.1.0] - 2026

### Added

- Monorepo architecture
- AST package
- Parser
- Validator
- Graph package
- SVG renderer
- Symbol library
- Auto layout foundation
- AI Schema
- AI → ElectroDSL generator
- Project documentation
- GitHub project governance

---

## Future

- Typed engineering units
- Reusable circuit templates
- Language server and editor tooling
- Multi-renderer architecture
- VS Code extension
