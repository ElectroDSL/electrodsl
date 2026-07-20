# ElectroDSL Syntax Specification

## Version

ElectroDSL Syntax Specification v0.1

Status: Draft Specification

---

# 1. Introduction

This document defines the syntax rules used to write ElectroDSL files.

The syntax is designed to be:

- Easy for engineers to read
- Easy for software to parse
- Easy for AI systems to generate
- Extensible for future applications

ElectroDSL uses a structured block-based syntax.

---

# 2. General Syntax Structure

An ElectroDSL file consists of:

```text
Statement

Block

Property

Reference

Connection
```

Example:

```text
EDSL 0.1

CIRCUIT "Motor Starter"

    COMPONENT M1 : MOTOR

END CIRCUIT
```

---

# 3. Statements

A statement defines an object or action.

General format:

```text
KEYWORD value
```

Example:

```text
COMPONENT M1 : MOTOR
```

---

# 4. Blocks

Blocks contain related information.

General format:

```text
KEYWORD "Name"

    statements

END KEYWORD
```

Example:

```text
CIRCUIT "Lighting"

    COMPONENT L1 : LAMP

END CIRCUIT
```

---

# 5. Identifiers

Identifiers uniquely identify objects.

Format:

```text
TYPE identifier
```

Examples:

```text
COMPONENT M1 : MOTOR

COMPONENT Q1 : BREAKER

COMPONENT S1 : SWITCH
```

Rules:

- Must start with a letter
- May contain numbers
- May contain underscore
- Cannot contain spaces

Valid:

```
M1

MAIN_BREAKER

TEMP_SENSOR_01
```

Invalid:

```
1MOTOR

MAIN MOTOR

Q-1
```

---

# 6. Names

Human-readable names are enclosed in quotation marks.

Example:

```text
CIRCUIT "Emergency Lighting"

COMPONENT M1 : MOTOR LABEL "Pump Motor"
```

Names may contain:

- Spaces
- Symbols
- Descriptive text

---

# 7. Components

A component represents an electrical device.

General format:

```text
COMPONENT ID : TYPE
```

Example:

```text
COMPONENT M1 : MOTOR
```

More examples:

```text
COMPONENT Q1 : CIRCUIT_BREAKER

COMPONENT KM1 : CONTACTOR

COMPONENT T1 : TRANSFORMER

COMPONENT PLC1 : PLC
```

---

# 8. Component Properties

Properties define additional information.

General format:

```text
PROPERTY name = value
```

Example:

```text
COMPONENT M1 : MOTOR

    PROPERTY voltage = "415V"

    PROPERTY power = "5kW"

END COMPONENT
```

Common properties:

```text
voltage

current

power

frequency

manufacturer

model

description
```

---

# 9. Connections

Connections define electrical relationships.

General format:

```text
CONNECT source -> destination
```

Example:

```text
CONNECT Q1.OUT -> KM1.IN
```

Connections may reference:

- Components
- Pins
- Nets

---

# 10. Pin References

Pins are accessed using:

```text
component.pin
```

Example:

```text
CONNECT KM1.T1 -> M1.U
```

Meaning:

```
Contactor terminal T1
connected to
Motor terminal U
```

---

# 11. Nets

A net defines a common electrical connection.

Syntax:

```text
NET "Name"

    references

END NET
```

Example:

```text
NET "Three Phase Supply"

    Q1.L1

    Q1.L2

    Q1.L3

END NET
```

---

# 12. Symbols

Symbols define graphical representation.

Syntax:

```text
SYMBOL component = library.symbol
```

Example:

```text
SYMBOL M1 = IEC.MOTOR
```

The symbol does not change electrical behaviour.

---

# 13. Pages

Pages organize drawings.

Syntax:

```text
PAGE "Name"

    content

END PAGE
```

Example:

```text
PAGE "Power Circuit"

END PAGE
```

---

# 14. Metadata

Metadata describes the project.

Example:

```text
METADATA

    author = "Engineer"

    revision = "A"

    date = "2026"

END METADATA
```

---

# 15. Complete Example

```text
EDSL 0.1


CIRCUIT "Motor Starter"

    COMPONENT Q1 : BREAKER

    COMPONENT KM1 : CONTACTOR

    COMPONENT OL1 : OVERLOAD

    COMPONENT M1 : MOTOR


    CONNECT Q1.OUT -> KM1.IN

    CONNECT KM1.OUT -> OL1.IN

    CONNECT OL1.OUT -> M1.U


END CIRCUIT
```

---

# 16. Syntax Design Rules

ElectroDSL syntax follows these principles:

## Explicit

The meaning should be clear.

## Consistent

Similar objects use similar syntax.

## Extensible

New features should not break existing files.

## Human Friendly

Engineers should be able to read designs without software.

---

# 17. Future Syntax Extensions

Future versions may add:

- Conditional logic
- Templates
- Reusable modules
- Calculations
- Simulation directives
- Automation rules

---

# 18. Summary

The basic ElectroDSL syntax consists of:

```text
EDSL

PROJECT

CIRCUIT

COMPONENT

CONNECT

NET

PROPERTY

SYMBOL

PAGE
```

These form the foundation of the ElectroDSL language.
