# ElectroDSL Architecture

> **Architecture Version:** 0.1
>
> This document describes the architecture of the ElectroDSL reference implementation and the responsibilities of each package.

---

# Vision

ElectroDSL is an open, AI-native language for electrical engineering.

The project separates the engineering workflow into independent stages.

Each stage has one responsibility and communicates through well-defined data structures.

---

# Compilation Pipeline

```
Natural Language
        │
        ▼
 AI Assistant
        │
        ▼
 AI Schema
        │
        ▼
 ElectroDSL Source (.edsl)
        │
        ▼
 Parser
        │
        ▼
 AST
        │
        ▼
 Electrical Graph
        │
        ▼
 Auto Layout
        │
        ▼
 Diagram Model (Future)
        │
        ▼
 SVG Renderer
```

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

# Package Responsibilities

## @electrodsl/ast

Purpose

Defines the Abstract Syntax Tree used throughout the project.

Responsibilities

- AST node definitions
- Document model
- Circuit model
- Component model
- Connection model

Does NOT

- Parse files
- Validate designs
- Render graphics

---

## @electrodsl/parser

Purpose

Converts ElectroDSL source into an AST.

Responsibilities

- Lexer
- Grammar
- CST generation
- AST generation

Input

```
.edsl
```

Output

```
DocumentNode
```

---

## @electrodsl/validator

Purpose

Validates engineering rules.

Examples

- Duplicate IDs
- Missing references
- Invalid connections

---

## @electrodsl/graph

Purpose

Creates an electrical graph from the AST.

Responsibilities

- GraphBuilder
- Nodes
- Ports
- Edges
- Traversal
- Queries

Input

```
DocumentNode
```

Output

```
ElectricalGraph
```

---

## @electrodsl/layout

Purpose

Calculates automatic component placement.

Responsibilities

- Layer calculation
- Grid placement
- Future routing algorithms

Input

```
ElectricalGraph
```

Output

```
LayoutResult
```

---

## @electrodsl/library

Purpose

Provides IEC symbol definitions.

Responsibilities

- Symbol metadata
- SVG symbol files
- Library indexing

---

## @electrodsl/renderer-svg

Purpose

Produces SVG drawings.

Responsibilities

- Draw components
- Draw wires
- Labels
- SVG document generation

Current Status

Uses internal positioning.

Future

Will consume LayoutResult / Diagram Model.

---

## @electrodsl/ai-schema

Purpose

Provides AI-friendly engineering models.

Responsibilities

- DesignIntent
- AISchematic
- AI → ElectroDSL generation

---

## @electrodsl/integration

Purpose

Integration testing.

Responsibilities

- End-to-end pipeline
- Regression testing
- Reference workflows

---

# Data Flow

```
ElectroDSL Source
        │
        ▼
Parser
        │
        ▼
AST
        │
        ▼
Graph
        │
        ▼
Layout
        │
        ▼
Renderer
```

Each package only depends on the output of the previous stage.

---

# Design Principles

## Single Responsibility

Each package performs one task.

---

## Renderer Independence

Renderers should not perform engineering calculations.

---

## AI Friendly

AI generates engineering intent.

The reference implementation converts that intent into schematics.

---

## Extensibility

New renderers, layout engines, validation rules, and symbol libraries can be added without changing existing packages.

---

# Future Architecture

```
Graph
   │
   ├── IEC Layout
   ├── Ladder Layout
   ├── AI Layout
   └── Force Layout
          │
          ▼
    Diagram Model
          │
          ├── SVG
          ├── Canvas
          ├── PDF
          ├── DXF
          └── Web
```

---

# Guiding Principle

ElectroDSL is an engineering language.

The reference implementation demonstrates how to transform engineering intent into professional electrical schematics while remaining renderer-independent and AI-native.