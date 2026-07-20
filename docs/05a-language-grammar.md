# ElectroDSL Language Grammar

Version: 0.1

Status: Draft

---

# Purpose

This document defines the formal grammar of the ElectroDSL language.

The grammar specifies how valid ElectroDSL source files are structured.

Parser implementations should conform to this specification.

---

# Design Goals

The grammar shall be:

- deterministic
- easy to parse
- AI friendly
- human readable
- extensible

---

# Language Structure

An ElectroDSL document consists of:

```text
Document

    Version

    Project

        Circuit*

            Component*

            Connection*

            Net*

            Page*
```

---

# File Structure

General form:

```text
EDSL Version

PROJECT {

}
```

Example:

```text
EDSL 0.1

PROJECT "Example" {

}
```

---

# Blocks

Blocks use braces.

General form:

```text
KEYWORD {

}
```

Named blocks:

```text
KEYWORD "Name" {

}
```

Examples:

```text
PROJECT "Hospital" {

}
```

```text
CIRCUIT "Lighting" {

}
```

---

# Statements

A statement may be one of:

```text
Component

Connection

Net

Import

Page

Property
```

---

# Components

General syntax

```text
COMPONENT Identifier : Type {

}
```

Example

```text
COMPONENT M1 : MOTOR {

}
```

---

# Properties

Properties use assignment.

```text
property = value
```

Example

```text
voltage = 415V

power = 5kW

manufacturer = "ABB"
```

---

# Connections

General form

```text
CONNECT source -> destination
```

Example

```text
CONNECT KM1.T1 -> M1.U
```

---

# Pin References

Pin references use dot notation.

```text
Component.Pin
```

Example

```text
KM1.A1

KM1.A2

M1.U

M1.V

M1.W
```

---

# Nets

```text
NET "Motor Supply" {

}
```

---

# Pages

```text
PAGE "Power Circuit" {

}
```

---

# Comments

Single line

```text
// comment
```

Future versions may support

```text
/*

multi-line comment

*/
```

---

# Reserved Keywords

Current keywords:

```text
EDSL

PROJECT

CIRCUIT

PAGE

COMPONENT

CONNECT

NET

IMPORT

LIBRARY
```

---

# Future Grammar

Future versions may introduce

- MODULE
- TEMPLATE
- MACRO
- INCLUDE
- FUNCTION
- RULE

without changing existing syntax.
