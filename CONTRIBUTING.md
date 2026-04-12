# Contributing to QA Skill Suite

Thank you for your interest in contributing to the QA Skill Suite! This document provides guidelines for contributing to make the process smooth for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Skill Structure Requirements](#skill-structure-requirements)
- [Style Guidelines](#style-guidelines)
- [Review Process](#review-process)

---

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## Getting Started

### Prerequisites

1. Familiarity with ISTQB testing concepts
2. Experience with at least one AI coding assistant (Claude Code, GitHub Copilot, Cursor)
3. Understanding of Markdown formatting

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/qa-skill-suite.git
   cd qa-skill-suite
   ```
3. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/nntan90/qa-skill-suite/issues)
2. If not, create a new issue using the **Bug Report** template
3. Include:
   - Which skill is affected
   - Steps to reproduce
   - Expected vs actual behavior
   - AI tool and version used

### Suggesting Features

1. Check existing issues and discussions first
2. Create a new issue using the **Feature Request** template
3. Explain the problem and proposed solution

### Proposing New Skills

1. Create a new issue using the **New Skill Proposal** template
2. Include:
   - Skill name and description
   - ISTQB/industry alignment
   - Use cases and trigger phrases
   - Proposed structure

### Submitting Changes

1. Make your changes following the [Style Guidelines](#style-guidelines)
2. Test your changes with at least one AI tool
3. Update documentation as needed
4. Update CHANGELOG.md
5. Submit a pull request using the PR template

---

## Skill Structure Requirements

Every skill MUST follow this structure:

```
skill-name/
├── SKILL.md                      # Main skill definition (REQUIRED)
├── assets/
│   └── templates/
│       └── [templates].md        # Reusable templates
└── references/
    └── [cheatsheets].md          # Quick reference guides
```

### SKILL.md Required Sections

```markdown
---
name: skill-name
description: >
  [Description of what this skill does, when to load it,
  and what trigger phrases activate it]
metadata:
  author: qa-skill-suite
  version: '4.1'
---

# Skill Name
## [Alignment with ISTQB/Standards]

## When to Use This Skill
[List of scenarios when this skill should be loaded]

## Agent Persona
[Standard senior QA persona definition]

## Output Review Loop
[Self-check template]

## Input Schema
[Required and optional inputs]

## Output Contract
[Required output sections]

## Workflow
[Step-by-step process]

## [Technique-Specific Sections]
[Detailed guidance for the skill domain]

## Output Review — How to Review Agent's Work
[Prompt for self-review]

## References
[Links to templates and cheatsheets]
```

---

## Style Guidelines

### Language

- **English only** — No mixed languages in any file
- **B1 level English** — Simple, clear sentences
- **Active voice** — "Add a test" not "A test should be added"
- **One idea per sentence** — Keep it simple

### Markdown

- Use ATX-style headers (`#`, `##`, `###`)
- Use fenced code blocks with language identifiers
- Use tables for structured data
- Add blank lines between sections
- Keep lines under 120 characters

### Naming Conventions

```
Skill folders:     lowercase-with-hyphens (e.g., api-test)
Template files:    lowercase-with-hyphens.md (e.g., bug-report-standard.md)
Code templates:    framework-starter.ext (e.g., pytest-starter.py)
TC-IDs:            [PROJECT]-[MODULE]-[TYPE]-[NNN] (e.g., AUTH-LOGIN-FN-001)
```

### Version Numbers

- Use semantic versioning (X.Y.Z)
- Update version in SKILL.md metadata when making changes
- Keep all skill versions in sync with the root SKILL.md

### ISTQB Alignment

- Reference ISTQB terms and techniques where applicable
- Use the official ISTQB glossary definitions
- Note the ISTQB level (Foundation, Advanced TA, Advanced TM, TTA)

---

## Review Process

### What We Look For

1. **Structure compliance** — Follows the required skill structure
2. **ISTQB alignment** — Uses correct terminology and techniques
3. **Language quality** — Clear, consistent English at B1 level
4. **Completeness** — All required sections present
5. **Testing** — Verified with at least one AI tool
6. **Documentation** — CHANGELOG updated, version incremented

### Timeline

- **Initial review**: Within 3-5 business days
- **Feedback incorporation**: Up to 7 days
- **Merge decision**: After all feedback is addressed

### Getting Help

- **Questions**: Open a [Discussion](https://github.com/nntan90/qa-skill-suite/discussions)
- **Stuck on implementation**: Comment on your PR for guidance
- **Design decisions**: Create an issue for discussion first

---

## Recognition

Contributors will be recognized in:
- CHANGELOG.md (for each contribution)
- README.md (for significant contributions)

Thank you for helping make the QA Skill Suite better for everyone! 🎯
