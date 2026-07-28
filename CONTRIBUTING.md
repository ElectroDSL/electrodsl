# Contributing to ElectroDSL

First, thank you for your interest in contributing to ElectroDSL.

ElectroDSL is an open, AI-native language and reference implementation for electrical engineering schematics. Our goal is to build an open standard that benefits engineers, educators, researchers, and software developers worldwide.

---

# Code of Conduct

Please read the Code of Conduct before contributing.

All contributors are expected to behave professionally and respectfully.

---

# Development Philosophy

ElectroDSL follows several important principles.

## Engineering First

ElectroDSL models electrical engineering concepts rather than graphical drawings.

## AI Native

The language should be easy for both humans and AI systems to understand and generate.

## Open Standard

The language specification is independent of any renderer or editor.

## Modular Architecture

Each package should have a single responsibility.

---

# Repository Structure

```
packages/

├── ai-schema
├── ast
├── cli
├── graph
├── integration
├── layout
├── library
├── parser
├── renderer-svg
├── shared
└── validator
```

---

# Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
pnpm install
```

Build everything

```bash
pnpm build
```

Run all tests

```bash
pnpm test
```

---

# Development Workflow

1. Create a new branch

```
feature/my-feature
```

2. Make one logical change.

3. Build the workspace.

```bash
pnpm build
```

4. Run all tests.

```bash
pnpm test
```

5. Commit using a descriptive message.

Example:

```
Add automatic wire routing
```

6. Open a Pull Request.

---

# Coding Guidelines

## TypeScript

- Use strict typing.
- Avoid `any`.
- Prefer interfaces for public APIs.
- Export only public functionality.

---

## Naming

Classes

```
GraphBuilder
LayerCalculator
AutoLayout
```

Functions

```
parse()
build()
renderSVG()
```

Interfaces

```
ElectricalGraph
LayoutResult
DocumentNode
```

---

## Comments

Explain **why**, not **what**.

Good:

```ts
// Layer assignment minimizes wire crossings.
```

Avoid:

```ts
// Increment x.
x++;
```

---

# Testing

Every new feature should include appropriate tests.

Examples

- Parser tests
- Validator tests
- Graph tests
- Layout tests
- Integration tests

A Pull Request should not reduce test coverage.

---

# Documentation

Update documentation whenever public APIs or behavior changes.

Relevant files include:

- README.md
- ROADMAP.md
- ARCHITECTURE.md

---

# Reporting Bugs

Include:

- Operating System
- Node version
- PNPM version
- ElectroDSL version
- Reproduction steps

---

# Feature Requests

Describe:

- The engineering problem
- The proposed solution
- Expected behavior
- Possible implementation

---

# Pull Request Checklist

Before submitting:

- [ ] Project builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No unnecessary dependencies added
- [ ] Public APIs reviewed

---

# Questions

If you are unsure about a design decision, open a discussion before implementing major changes.

Large architectural changes should be discussed before development begins.

---

Thank you for helping build ElectroDSL.