# ElectroDSL Abstract Syntax Tree (AST)

## Version

ElectroDSL AST Specification v0.1

Status: Draft Specification

---

# 1. Purpose

The Abstract Syntax Tree (AST) is the canonical representation of an ElectroDSL document.

Every conforming parser shall produce an AST that follows this specification.

The AST represents the semantic meaning of an electrical design and is independent of the source text formatting or graphical layout.

---

# 2. Design Goals

The AST shall be:

- Language independent
- Deterministic
- Serializable
- Easy to validate
- Easy to render
- Suitable for AI processing

---

# 3. Root Node

Every AST begins with a Document node.

```text
Document
```

Example:

```text
Document
 └── Project
```

---

# 4. Document Node

Properties:

```text
version

profile

libraries

project
```

Example:

```text
Document
    version = "0.1"
```

---

# 5. Project Node

A Project contains:

```text
Project

    name

    metadata

    circuits
```

---

# 6. Circuit Node

```text
Circuit

    name

    components

    connections

    nets
```

---

# 7. Component Node

```text
Component

    id

    type

    library

    properties

    pins
```

Example:

```text
Component

id = M1

type = MOTOR

library = IEC
```

---

# 8. Property Node

```text
Property

name

value
```

Example:

```text
voltage = 415V
```

---

# 9. Pin Node

```text
Pin

name
```

Example:

```text
U

V

W

PE
```

---

# 10. Connection Node

```text
Connection

source

destination
```

Example:

```text
KM1.T1

↓

M1.U
```

---

# 11. Net Node

```text
Net

name

members
```

---

# 12. Metadata Node

```text
Metadata

author

revision

date
```

---

# 13. AST Example

ElectroDSL:

```text
COMPONENT M1 : MOTOR {
    voltage = 415V
}
```

AST:

```text
Component

    id = "M1"

    type = "MOTOR"

    properties

        voltage = "415V"
```

---

# 14. Rendering

Renderers consume the AST.

The AST contains electrical meaning only.

It does not contain drawing coordinates.

---

# 15. Validation

Validators analyze the AST.

Examples:

- duplicate identifiers
- invalid connections
- missing components
- profile violations

---

# 16. AI Integration

AI systems should consume and produce AST-compatible ElectroDSL.

The AST provides a stable interface for:

- code generation
- design analysis
- optimization
- documentation
