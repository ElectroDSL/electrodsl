# ElectroDSL Design Principles

## Version

ElectroDSL Design Principles v0.1

Status: Draft Specification

---

# 1. Introduction

ElectroDSL is an open, human-readable, machine-processable language for describing electrical schematics.

The purpose of ElectroDSL is to provide a vendor-neutral interchange format that allows engineers, software tools, and artificial intelligence systems to create, exchange, validate, and render electrical designs.

ElectroDSL is inspired by successful open standards such as HTML, Markdown, JSON, and SVG.

---

# 2. Core Philosophy

ElectroDSL describes electrical systems, not drawings.

A schematic is a representation of an electrical design. The electrical meaning must exist independently from how it is visually displayed.

The same ElectroDSL file should be capable of being rendered as:

- IEC schematic
- ANSI schematic
- Single-line diagram
- Control diagram
- Wiring diagram
- Documentation view
- Simulation model

The source file represents engineering intent. The renderer determines presentation.

---

# 3. Human Readable

ElectroDSL files must be understandable by engineers without requiring specialized software.

Example:
COMPONENT M1 : MOTOR

COMPONENT KM1 : CONTACTOR

CONNECT KM1.OUT -> M1.IN


The language should communicate electrical meaning clearly.

---

# 4. Machine Friendly

ElectroDSL must be easy for software systems to parse.

Requirements:

- Deterministic grammar
- Formal specification
- No ambiguous syntax
- Well-defined data structures
- Stable versioning

---

# 5. AI Friendly

ElectroDSL is designed for interaction with artificial intelligence systems.

The language should allow AI systems to:

- Generate schematics from natural language
- Understand existing designs
- Modify circuits
- Validate designs
- Explain electrical systems

The syntax should minimize unnecessary complexity.

---

# 6. Separation of Meaning and Appearance

ElectroDSL separates:

## Electrical Model

Example:
MOTOR M1
CONNECT KM1 TO M1


from:

## Visual Representation

Example:
Position:
M1 at (500,300)

Symbol:
IEC_motor.svg


Different rendering systems may display the same design differently.

---

# 7. Open Standard

ElectroDSL is an open specification.

No single company, application, or editor owns the language.

Implementations may include:

- CAD applications
- Web editors
- Mobile applications
- AI tools
- Simulation software
- Industrial engineering tools

The specification defines the standard.

---

# 8. Text as the Source of Truth

The ElectroDSL text file is the primary representation of a design.

Benefits:

- Version control with Git
- Easy comparison
- Easy collaboration
- Easy automation
- Long-term archival

---

# 9. Extensibility

ElectroDSL must support future technologies without breaking existing files.

Extension mechanisms include:

- Custom components
- Custom attributes
- Symbol libraries
- Domain profiles

Examples:

- Building electrical
- Industrial automation
- Marine systems
- Biomedical equipment
- Renewable energy

---

# 10. Compatibility

Existing ElectroDSL files should remain usable in future versions.

Breaking changes require a major version increase.

Example:
ElectroDSL 1.x

compatible with

ElectroDSL 1.x


---

# 11. Domain Neutrality

ElectroDSL should support multiple engineering domains.

Initial focus:

- Electrical schematics
- Control circuits
- Power distribution
- Industrial automation

Future support:

- Electronics
- Automotive
- Aerospace
- Marine
- Biomedical systems

---

# 12. Community Governance

The standard evolves through community participation.

Changes are proposed through:

ElectroDSL Proposals (EDPs)

Each proposal must describe:

- Problem
- Proposed solution
- Compatibility impact
- Implementation considerations

---

# 13. Reference Implementations

The official reference implementations demonstrate the specification but do not define it.

The specification remains the authoritative source.

---

# 14. Summary

ElectroDSL aims to become:

> A modern, AI-friendly, open electrical schematic language.

The goal is not to replace CAD software.

The goal is to create a common language that allows all electrical engineering tools to communicate.

