# Changelog

All notable changes to ElectroDSL will be documented in this file.

The format follows Keep a Changelog.

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
