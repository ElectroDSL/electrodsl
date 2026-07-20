# ElectroDSL Language Overview

## Version

ElectroDSL Language Overview v0.1

Status: Draft Specification

---

# 1. Introduction

This document defines the fundamental concepts of the ElectroDSL language.

ElectroDSL describes electrical systems using semantic objects.

A design consists of:

- Projects
- Circuits
- Components
- Pins
- Connections
- Nets
- Properties
- Symbols
- Pages

---

# 2. Basic Model

The ElectroDSL model is:

```text
Electrical System

        |
        |
     Circuit

        |
        |
 Components ---- Properties

        |
        |
      Pins

        |
        |
 Connections

        |
        |
       Nets
```

---

# 3. Project

A Project represents a complete engineering design.

A project may contain:

- Multiple circuits
- Multiple pages
- Component libraries
- Documentation
- Metadata

Example:

```text
PROJECT "Hospital Electrical System"

    CIRCUIT "Emergency Power"

    CIRCUIT "Lighting"

END PROJECT
```

---

# 4. Circuit

A Circuit represents an electrical design section.

Examples:

- Motor starter
- Lighting circuit
- Power distribution
- Control circuit

Example:

```text
CIRCUIT "Motor Starter"

    Components

    Connections

END CIRCUIT
```

---

# 5. Component

A Component represents a physical electrical device.

Examples:

- Circuit breaker
- Motor
- Relay
- Transformer
- Switch
- Sensor
- PLC

Every component has:

- Identifier
- Type
- Properties
- Pins
- Symbol reference

Example:

```text
COMPONENT M1 : MOTOR
```

---

# 6. Component Identifier

Every component must have a unique identifier.

Example:

```text
COMPONENT Q1 : BREAKER

COMPONENT KM1 : CONTACTOR

COMPONENT M1 : MOTOR
```

Identifiers allow components to be referenced by other objects.

---

# 7. Pin

A Pin represents a connection point on a component.

Examples:

Motor:

```text
U
V
W
PE
```

Contactor:

```text
A1
A2
L1
L2
T1
T2
```

Pins define how components connect.

---

# 8. Connection

A Connection defines an electrical relationship between pins.

Example:

```text
CONNECT Q1.OUT -> KM1.IN
```

A connection describes meaning, not drawing geometry.

---

# 9. Net

A Net represents an electrically connected group.

Example:

```text
NET "Motor Supply"

    Q1.OUT

    KM1.L1

    M1.U

END NET
```

All objects connected to the same net share electrical connectivity.

---

# 10. Properties

Properties describe component information.

Examples:

```text
PROPERTY voltage = "415V"

PROPERTY current = "10A"

PROPERTY manufacturer = "Example"
```

Properties may include:

- Electrical ratings
- Manufacturer information
- Installation details
- Documentation data

---

# 11. Symbol

A Symbol defines the graphical representation of a component.

The symbol is separate from the electrical meaning.

Example:

```text
COMPONENT M1 : MOTOR

SYMBOL IEC_MOTOR
```

The same component may use different symbols:

- IEC
- ANSI
- Single line
- Functional diagram

---

# 12. Page

A Project may contain multiple pages.

Examples:

```text
PAGE "Power Circuit"

PAGE "Control Circuit"

PAGE "Wiring Diagram"
```

Pages control documentation organization.

---

# 13. Metadata

Metadata provides information about the design.

Example:

```text
METADATA

author = "Engineer Name"

revision = "A"

date = "2026"

END METADATA
```

---

# 14. Semantic First Design

ElectroDSL separates:

## Electrical Meaning

Example:

```text
Motor connected to contactor
```

from:

## Visual Representation

Example:

```text
Motor symbol placed at coordinate (500,300)
```

The electrical model always remains independent.

---

# 15. Summary

The fundamental ElectroDSL objects are:

```text
Project

    Circuit

        Component

            Pin

        Connection

        Net

        Property

        Symbol

    Page

    Metadata
```

These objects form the foundation of all ElectroDSL files.
