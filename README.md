# vibe-coding-zero-to-ship

A beginner foundation layer for AI-assisted product building.

This project is for people who can describe a product idea but may not yet know the software-development concepts that advanced coding agents often assume: Git, data persistence, databases, authentication, secrets, deployment, public/private visibility, product completeness, cost, and maintenance.

## Why this exists

Advanced coding skills often start **after** the beginner knowledge gap:

- “Use Git” — but the user may not know why version history matters.
- “Add a database” — but the user may not know where app data lives.
- “Deploy it” — but the user may not know the difference between localhost and a public product.
- “Store the API key in env” — but the user may not know an API key is effectively a password.
- “Add auth” — but the user may not know login and data permissions are different problems.

This skill fills that missing foundation without turning product building into a programming course.

## Core idea

> Never assume the user knows what they need to know.

And equally:

> If the missing knowledge does not matter to the current decision, stay silent.

## What the skill does

It helps an AI coding agent:

- detect foundational gaps the user may not know to ask about;
- explain only the concept needed for the next decision;
- handle routine technical work instead of making the user become a programmer;
- surface consequential decisions around money, privacy, public exposure, credentials, and irreversible actions;
- prefer the simplest architecture that satisfies the current need;
- route into focused references, workflows, and safety checklists only when relevant;
- keep building after the safeguard instead of stopping at a warning.

It is **not** a programming course and should not interrupt harmless creative work with unnecessary explanations.

## Example

A beginner says:

> I want to make a diary app.

A typical coding agent may immediately choose a stack.

This skill first notices the hidden product questions that actually change the build:

- Should entries still exist after the browser closes?
- Should they appear on another device?
- Is this only for one person or for multiple users?
- If multiple users exist, who can see whose entries?
- Is the deployed app public or access-controlled?

It asks only the questions that matter **now**, then continues the build.

## Structure

- `SKILL.md` — minimal router and permanent rules
- `references/` — on-demand foundational knowledge
- `workflows/` — beginner product-building flows
- `checklists/` — safety and launch gates
- `templates/` — lightweight product/project state templates
- `tests/` — trigger, behavior, and anti-annoyance scenarios

## Install in Codex

Codex can discover skills from a repo-scoped or user-scoped skills directory.

### Repo-scoped

Clone this repository into:

```text
.codex/skills/vibe-coding-zero-to-ship/
```

### User-scoped

Clone this repository into:

```text
~/.codex/skills/vibe-coding-zero-to-ship/
```

The folder should contain this repository's `SKILL.md` at its root.

Example:

```text
~/.codex/skills/
└── vibe-coding-zero-to-ship/
    ├── SKILL.md
    ├── references/
    ├── workflows/
    ├── checklists/
    ├── templates/
    └── tests/
```

Other Agent Skills-compatible hosts can use the same bundle if they support a `SKILL.md` manifest and supporting files; installation paths vary by host.

## Design principles

1. Never assume technical knowledge.
2. Do not lecture.
3. Concept before jargon.
4. Agent handles routine technical complexity.
5. Human controls consequential decisions.
6. Use the simplest sufficient architecture.
7. A working UI is not automatically a complete product.
8. Detect important questions the user does not know to ask.
9. Stay quiet when foundations are irrelevant.
10. Protect experimentation: a harmless prototype should not be buried under production ceremony.

## Project and user levels

The skill separates **user experience level** from **project risk**.

A first-time builder can be making a serious shared product, and a technical user can be making a harmless local experiment.

Project levels:

- **P0** — local experiment
- **P1** — personal product
- **P2** — shared product
- **P3** — commercial or sensitive product

Checks become stricter only when the product actually becomes riskier.

## Tests

`tests/evals.csv` contains positive and negative trigger cases.

The negative cases matter: a foundation skill that explains Git every time someone changes a button is a bad foundation skill.

`tests/scenarios.md` additionally evaluates:

- detection;
- restraint;
- safety;
- human agency;
- continuity after a safeguard.

## Status

Early working version. The first release is intentionally instruction-only: test routing, behavior, and safety coverage before adding scripts or more automation.

## Influences

See `ACKNOWLEDGEMENTS.md` for projects and public workflows that informed the design.

## License

MIT. See [LICENSE](LICENSE).
