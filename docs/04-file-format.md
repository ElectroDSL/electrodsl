# ElectroDSL File Format Specification

## Version

ElectroDSL File Format v0.1

Status: Draft Specification

---

# 1. Introduction

This document defines the structure and rules of an ElectroDSL file.

An ElectroDSL design is stored as a plain text file using the extension:

```
.edsl
```

Example:

```
motor-starter.edsl
```

ElectroDSL files are designed to be:

- Human readable
- Machine parsable
- Version controllable
- AI generated
- Long-term archivable

---

# 2. File Encoding

ElectroDSL files shall use:

```
UTF-8
```

The use of UTF-8 ensures compatibility across operating systems and programming languages.

---

# 3. File Extension

The standard file extension is:

```
.edsl
```

Examples:

```
house.edsl

motor-control.edsl

ship-power.edsl
```

---

# 4. File Structure

A valid ElectroDSL file follows this structure:

```text
EDSL Version

Metadata

Project

Circuit Definitions

Components

Connections

Properties
```

---

# 5. Version Declaration

Every ElectroDSL file must declare the language version.

Example:

```text
EDSL 0.1
```

The version declaration must appear at the beginning of the file.

---

# 6. Basic File Example

Example:

```text
EDSL 0.1

CIRCUIT "Lighting Circuit"

    COMPONENT S1 : SWITCH

    COMPONENT L1 : LAMP

    CONNECT S1.OUT -> L1.IN

END CIRCUIT
```

---

# 7. Comments

Comments allow engineers to add explanations.

Single line comments use:

```text
// comment
```

Example:

```text
// Main lighting circuit

COMPONENT L1 : LAMP
```

Comments do not affect electrical meaning.

---

# 8. Naming Rules

Every object requiring an identifier must follow these rules:

Allowed:

```
Q1

MOTOR_01

MAIN_BREAKER

TEMP_SENSOR
```

Not allowed:

```
Motor 1

#motor

Motor-1
```

---

# 9. Identifiers

Identifiers should be:

- Unique within a project
- Easy to understand
- Case sensitive

Example:

Valid:

```text
Q1

KM1

MOTOR01
```

Invalid:

```text
Q1

Q1
```

Duplicate identifiers are not allowed.

---

# 10. Keywords

Reserved keywords define the ElectroDSL language.

Initial reserved keywords:

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

METADATA

END
```

Future versions may add additional keywords.

---

# 11. Blocks

ElectroDSL uses blocks to group information.

Example:

```text
CIRCUIT "Motor"

    COMPONENT M1 : MOTOR

END CIRCUIT
```

Blocks begin with a keyword and end with:

```
END
```

---

# 12. Case Sensitivity

Keywords are uppercase.

Example:

Correct:

```text
COMPONENT M1 : MOTOR
```

Incorrect:

```text
component M1 : motor
```

User-defined names may use mixed case.

Example:

```text
COMPONENT MainMotor : MOTOR
```

---

# 13. Whitespace

Whitespace is ignored except where required for separation.

These are equivalent:

```text
COMPONENT M1 : MOTOR
```

and

```text
COMPONENT     M1     :     MOTOR
```

---

# 14. File Validation

A valid ElectroDSL file must:

- Contain a valid version declaration
- Follow the grammar
- Have unique identifiers
- Have valid component definitions
- Have valid connections

---

# 15. Future Extensions

Future versions may introduce:

- Import statements
- External libraries
- Templates
- Macros
- Simulation models
- Calculation blocks

Extensions must maintain backward compatibility.

---

# 16. Summary

A minimal ElectroDSL file consists of:

```text
Version

Circuit

Components

Connections
```

Example:

```text
EDSL 0.1

CIRCUIT "Example"

COMPONENT S1 : SWITCH

COMPONENT L1 : LAMP

CONNECT S1 -> L1

END CIRCUIT
```

The `.edsl` file is the primary source of truth for an electrical design.
