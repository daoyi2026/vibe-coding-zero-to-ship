# vibe-coding-zero-to-ship

A beginner foundation layer for AI-assisted product building.

This project is for people who may be able to describe a product idea but do not yet know the software-development concepts that advanced coding agents often assume: Git, data persistence, databases, authentication, secrets, deployment, public/private visibility, product completeness, cost, and maintenance.

## What this skill does

It helps an AI coding agent:

- detect foundational gaps the user may not know to ask about;
- explain only the concept needed for the next decision;
- handle routine technical work instead of turning the user into a programmer;
- surface consequential decisions around money, privacy, public exposure, and irreversible actions;
- prefer the simplest architecture that satisfies the current need;
- route into focused references, workflows, and safety checklists only when relevant.

It is **not** a programming course and should not interrupt harmless creative work with unnecessary explanations.

## Core idea

> Never assume the user knows what they need to know.

And equally:

> If the missing knowledge does not matter to the current decision, stay silent.

## Structure

- `SKILL.md` — minimal router and permanent rules
- `references/` — on-demand foundational knowledge
- `workflows/` — beginner product-building flows
- `checklists/` — safety and launch gates
- `templates/` — lightweight project state templates
- `tests/` — trigger, behavior, and anti-annoyance scenarios

## Status

Early working version. The goal of the first release is to test routing quality, safety coverage, and whether the skill stays quiet when it should.

## Intended compatibility

The skill follows the Agent Skills `SKILL.md` convention and is designed to be portable across capable coding agents that can read skill bundles.

## Design principles

1. Never assume technical knowledge.
2. Do not lecture.
3. Concept before jargon.
4. Agent handles routine technical complexity.
5. Human controls consequential decisions.
6. Use the simplest sufficient architecture.
7. A working UI is not automatically a complete product.
8. Detect important questions the user does not know to ask.

## License

No license has been selected yet.
