# Changelog

## v0.2.0 — unreleased

Restructure around the full beginner journey, and safety that does not depend on the model remembering.

### Why

- A baseline probe (Claude, 5 smoke cases, 2026-10-09) found strong discovery in English, questionnaire dumps in Chinese cases, and, most importantly, a built booking app that used a typed phone number as identity, so anyone could view and cancel other people's bookings.
- v0.1 E2E results tied a strong baseline on RLS, secrets and storage: the agent already *knows* these rules. The gap is applying them at the right moment, every time.

### Added

- `references/should-we-build.md`: existing tools, real-world launch blockers (filing, licences, platform approval, payments), and choosing the lightest product form.
- `references/verify-it-works.md`: run it, try failures, and for other people's data, attempt outside access (second account, signed out, swapped IDs, direct database access with the public key); report what was and wasn't checked.
- `references/stuck-and-recovery.md`: fix-loop stop rule, helping users report problems, resuming in a new session.
- `guards/`: zero-dependency scripts: secret scanner (files, staged, history), pre-commit hook installer, live-site self-check.
- `checklists/before-handoff.md`, `checklists/before-push.md`, `checklists/going-online.md`, tied to moments rather than topics.
- `tests/guards.test.mjs` (in CI) and `tests/v0.2-smoke.md`.

### Changed

- Target user defined as a capable adult with no programming knowledge.
- `SKILL.md` cut from 180 to about 100 lines; duplicate discovery lists merged into `references/discovery.md`; host-specific wording removed.
- Description rewritten with concrete English and Chinese trigger phrases.
- Data, accounts, privacy and uploads merged into `references/data-and-users.md`. It now explicitly rejects typed-in phone/email as identity.
- Deployment, launch, cost and maintenance merged into `references/going-online.md`. Managed hosting is the default, with a minimum hardening list for servers.
- `PRODUCT.md` and `PROJECT_STATE.md` merged into `templates/PROJECT.md`.
- Destructive-action checklist now covers unattended runs.

### Removed

- `workflows/` (merged into references), `references/security-routing.md`, `project-basics.md`, `beginner-mode.md`, `product-completeness.md`, `cost-awareness.md`, `maintenance.md`, `deployment.md`, `privacy.md`, `auth-and-users.md`, `data-basics.md`, `git-and-recovery.md`, `checklists/pre-deploy.md`, `pre-public.md`, `production-ready.md` (content merged or rewritten as above).

## v0.1.0 — 2026-09-30

First public working release candidate of **vibe-coding-zero-to-ship**.

### Added

- Beginner-first `SKILL.md` router with progressive disclosure.
- Foundation references for:
  - beginner communication;
  - project basics;
  - data persistence;
  - Git and recovery;
  - authentication and users;
  - secrets;
  - privacy;
  - deployment;
  - product completeness;
  - cost awareness;
  - maintenance;
  - security routing.
- Core workflows from idea to launch.
- Safety checklists for public exposure, deployment, production readiness, and destructive actions.
- Lightweight `PRODUCT.md` and `PROJECT_STATE.md` templates.
- Positive and negative routing eval dataset.
- Isolated Codex eval harness.
- Static validation CI.
- Safe macOS/Linux installer with overwrite protection and automatic backup on update.
- MIT License.

### Design goals

- Fill foundational gaps without turning the user into a programmer.
- Stay quiet when no foundational gap matters.
- Let the agent handle routine technical complexity.
- Surface cost, privacy, public exposure, credential, and irreversible decisions.
- Prefer the simplest sufficient architecture.
- Keep harmless prototypes lightweight.

### Known limitation

Live Codex routing evals are not part of default CI because the repository intentionally avoids requiring or storing OpenAI credentials. The deterministic static suite and installer smoke tests run on every push and pull request.
