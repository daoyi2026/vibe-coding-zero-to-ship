# Changelog

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
