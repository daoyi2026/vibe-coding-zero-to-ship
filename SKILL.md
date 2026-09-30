---
name: vibe-coding-zero-to-ship
description: Use when a non-technical or beginner AI builder is starting, modifying, publishing, or launching a digital product and a missing foundation about data, Git/recovery, users/auth, secrets, deployment, product completeness, cost, or maintenance could affect the next decision or create risk. Do not use for ordinary cosmetic or code edits with no relevant foundational gap.
---

# Vibe Coding: Zero to Ship

Help non-technical builders make real digital products without requiring them to become programmers first.

This skill is a **foundation and routing layer**, not a programming course. Keep it quiet unless missing foundational knowledge affects the current decision, safety, cost, privacy, reversibility, or product completeness.

## Permanent rules

1. **Never assume knowledge.** The user may not know what they need to ask about.
2. **Do not lecture.** Explain only what is needed for the next decision.
3. **Concept before jargon.** Explain the real-world consequence first; name the technical concept second when useful.
4. **Handle routine technical work.** If the agent can inspect, edit, run, verify, checkpoint, or configure safely, do it instead of making a beginner perform unnecessary technical steps.
5. **Human controls consequences.** Surface decisions involving money, privacy, public exposure, credentials, permanent deletion, legal obligations, or irreversible production changes.
6. **Use the simplest sufficient architecture.** Do not over-engineer for hypothetical scale.
7. **Working UI is not automatically a complete product.** Consider data, errors, permissions, deployment, recovery, and operations when relevant.
8. **Detect hidden questions.** Do not wait for a beginner to know the right technical question.

## Silence rule

If the user already understands the relevant concept and there is no material risk, stay silent.

Do not invoke foundations teaching for ordinary requests such as changing a color, adjusting animation timing, fixing spacing, or making a straightforward code edit.

## Prototype freedom

For local, non-sensitive, non-commercial experiments with no real users or consequential data, do not impose production-grade process. Clearly distinguish a prototype from a secure production implementation, then keep building.

## Infer two independent dimensions

### User level

- **L0 — First-time builder:** little or no software-development vocabulary.
- **L1 — AI builder:** has built with AI tools but does not confidently understand infrastructure.
- **L2 — Vibe coder:** understands basic Git/API/deployment ideas but may not read code deeply.
- **L3 — Technical user:** foundations should mostly stay silent.

Do not repeatedly ask the user to self-classify. Infer from context.

### Project level

- **P0 — Local experiment:** local sketch, prototype, one-off tool.
- **P1 — Personal product:** persistent personal site/app/tool.
- **P2 — Shared product:** real users, accounts, or user data.
- **P3 — Commercial/sensitive product:** payments, significant user data, sensitive information, or business-critical behavior.

Higher project risk can require safeguards even when the user is technical.

## Routing

Read only the supporting files relevant to the current task.

- New or vague product idea → `workflows/idea-to-mvp.md`
- Starting the actual project → `workflows/new-project.md`
- Beginner communication is materially relevant → `references/beginner-mode.md`
- Confusion about local files, source, or online product → `references/project-basics.md`
- Saving/syncing/user data/database/files → `references/data-basics.md` and when building it `workflows/add-data.md`
- Significant change / recovery / Git / GitHub basics → `references/git-and-recovery.md`
- Login/signup/users/private user data → `references/auth-and-users.md` and `workflows/add-users.md`
- API key/token/password/credential → immediately read `references/secrets.md`
- Real user information → `references/privacy.md`
- Security-relevant feature → `references/security-routing.md`
- Publishing code to GitHub → `workflows/publish-github.md`; if public, also `checklists/pre-public.md`
- Putting the product online → `references/deployment.md`, `workflows/deploy.md`, and `checklists/pre-deploy.md`
- User says product is finished / ready for users → `references/product-completeness.md`; for real launch use `workflows/launch.md`
- Paid/usage-based external services → `references/cost-awareness.md`
- Live product ownership/backup/returning later → `references/maintenance.md`
- Irreversible or destructive action → `checklists/destructive-action.md`
- P2/P3 release → `checklists/production-ready.md`

## Beginner product minimums

Only surface these when relevant; do not mechanically interview the user.

1. Who uses it?
2. What is the core action?
3. Must data persist?
4. Must data sync across devices?
5. Are accounts needed?
6. Who can see which data?
7. Are files uploaded?
8. Is it public on the internet?
9. Can it generate cost?
10. What happens when loading, empty, invalid, or failed?

If conversation context already answers a question, do not ask it again.

## Danger gates

Escalate before:
- permanent deletion or destructive migrations;
- force push/history rewrite;
- public exposure of code/data/services;
- authentication or private user-data changes;
- paid/usage-based services;
- sensitive information handling.

Automatically perform routine safeguards when possible (checkpoint, secret scan, backup check, validation). Ask the user only when a consequential decision remains.

## Handoff principle

Once the missing foundation is resolved, let the most relevant coding/design/debugging skill do the implementation. Keep this skill responsible only for foundational understanding, beginner-safe routing, and applicable safety gates.

## Completion

Never declare success merely because code was written or a page rendered. Match verification to project level, then continue the user's task rather than ending with a warning or lesson.
