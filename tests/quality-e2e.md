# v0.1 End-to-End Benchmark

Run each project twice when practical:

- **Baseline:** same model, no vibe-coding-zero-to-ship skill.
- **Skill:** same model, skill enabled.

Keep model, tool permissions, initial files, and prompt constant.

## E01 — Personal diary

Risk level: P1

Prompt:

> Build me a simple diary I can use on this laptop. I want to write entries and still see them after I close and reopen it.

Success criteria:

- entries persist;
- no unnecessary account system;
- clear recovery path for project changes;
- basic empty/error handling appropriate to the stack;
- minimal architecture.

Watch for:

- needless cloud database;
- persistence not actually tested.

## E02 — Shared private journal

Risk level: P2

Prompt:

> Turn the diary into something my friends can use. Each person should have an account and must only see their own entries.

Success criteria:

- mature authentication;
- actual authorization/data ownership;
- User A cannot access User B records;
- persistence works;
- secrets not exposed;
- deployment path is real.

Critical failure:

- frontend-only privacy.

## E03 — Public AI generator

Risk level: P3

Prompt:

> Make this AI card generator public. Every card uses a paid model API.

Success criteria:

- API secret stays out of public client code;
- public endpoint has proportionate abuse/cost protection;
- deployment works;
- cost risk is surfaced to user;
- no unnecessary enterprise architecture.

## E04 — Creative p5.js prototype

Risk level: P0

Prompt:

> Make a local p5.js animation of stars flowing along a curved path. This is just an experiment.

Success criteria:

- fast implementation;
- no auth/database/deployment ceremony;
- no unnecessary questions;
- creative task remains primary.

Purpose:

This is a regression test for over-intervention.

## E05 — Portfolio site deployment

Risk level: P1

Prompt:

> My portfolio works locally. Publish it so I can send the link to people.

Success criteria:

- real deployed URL;
- no localhost confusion;
- no accidental secret/private-file exposure;
- simplest suitable static deployment;
- verifies the deployed page.

## E06 — Small app with user uploads

Risk level: P2

Prompt:

> Build a small profile app where users can sign in, edit their bio, and upload an avatar.

Success criteria:

- auth and authorization;
- suitable file/object storage;
- user ownership/access controls;
- upload failures handled;
- secrets managed correctly;
- no user can overwrite another user's profile/avatar.

## Scoring

Score each run from 1 to 5 on:

- Product correctness
- Safety
- Beginner burden
- Restraint
- Completion
- Recovery readiness

Maximum: 30.

For each project record:

- Baseline total
- Skill total
- Winner
- Major defects
- Critical failures
- Extra user steps required
- Whether the skill caused over-engineering

A v0.1 pass does not require the skill to win every project.

It should:

- clearly outperform baseline on P2/P3 foundational-risk projects;
- avoid regression on P0 harmless prototypes;
- avoid meaningful increase in beginner burden.
