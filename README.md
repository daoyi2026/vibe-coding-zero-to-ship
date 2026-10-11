# vibe-coding-zero-to-ship

[![Skill CI](https://github.com/daoyi2026/vibe-coding-zero-to-ship/actions/workflows/skill-ci.yml/badge.svg)](https://github.com/daoyi2026/vibe-coding-zero-to-ship/actions/workflows/skill-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Release: v0.1.0](https://img.shields.io/badge/release-v0.1.0-blue)](https://github.com/daoyi2026/vibe-coding-zero-to-ship/releases/tag/v0.1.0)

An agent skill that helps people with **no programming background** build real software with AI, and keeps them safe while they do it.

## Who it is for

A capable adult (say, a university graduate) who has never programmed. They know what they want, but not:

- whether it is worth building at all, or whether an existing tool already does it;
- what software needs that they never thought to ask about (where data lives, who can see it, what happens on a new phone);
- what can go wrong: a key pushed to GitHub, a database anyone can read, an AI feature a bot can run up a bill on;
- how to tell whether the AI's "done" is actually done.

They will trust whatever the agent says. Modern coding agents *know* most of the safety rules, but they don't *apply* them every time. In our own tests, a strong agent building a booking app let anyone view and cancel other people's bookings by typing a phone number. This skill exists for those moments.

## What it does

1. **Should this be built?** Checks for existing tools, real-world blockers (filing, licences, platform approval, payments), and the lightest form that fits (spreadsheet, page, home-screen app, mini program, store app). Building stays the user's choice.
2. **Asks only experience questions,** at most three at a time, then stops asking and builds. The user never has to choose a framework or database.
3. **Installs guards instead of relying on memory.** Dependency-free scripts:
   - `guards/install-guards.mjs` adds safe `.gitignore` entries and a Git pre-commit hook that **blocks commits containing secrets**;
   - `guards/secret-scan.mjs` scans files and full Git history before a push;
   - `guards/live-check.mjs` looks at a deployed site like an outsider would: public `.env`/`.git`, keys in front-end code, debug pages, unauthenticated admin APIs, and **database tables readable with the public key** (Supabase, Firebase).
4. **Proves it works.** Before handing over: runs it, tries the obvious failures, and for anything with other people's data tries to get in as a second user, signed out, and by swapping IDs. Then reports what was checked, what wasn't, and what the user should try.
5. **Gets it online safely.** Managed hosting by default, development features off, spending limits, accounts in the user's name, and a minimum hardening list if a server is unavoidable.
6. **Catches them when stuck.** Save points, a stop rule for fix-break-fix loops, and a `PROJECT.md` so a new session picks up where the last one left off.

It stays quiet for routine edits, for throwaway prototypes, and when the user has already handled a safeguard.

## Structure

```text
SKILL.md                 router and permanent rules (~100 lines)
references/              read only at the matching moment
  should-we-build.md     existing tools, real-world blockers, product form
  discovery.md           experience questions and when to stop asking
  data-and-users.md      storage, identity vs permission, personal data, uploads
  secrets.md             keys, public vs secret keys, what to do after a leak
  verify-it-works.md     run it, break it, try to get in from outside, report honestly
  going-online.md        managed hosting, exposure, cost, ownership, server hardening
  stuck-and-recovery.md  save points, fix loops, problem reports, resuming sessions
checklists/              before-handoff, before-push, going-online, destructive-action
guards/                  zero-dependency Node scripts (Node 18+)
templates/PROJECT.md     the product's memory inside the user's project
tests/                   benchmarks and guard tests (not installed)
```

## Install

See [INSTALL.md](INSTALL.md). Quick version:

```bash
bash scripts/install.sh                   # Codex: ~/.codex/skills
bash scripts/install.sh --target agents   # ~/.agents/skills
bash scripts/install.sh --target cursor   # ~/.cursor/skills
```

For Claude Code, copy the runtime folders (`SKILL.md`, `references/`, `checklists/`, `templates/`, `guards/`) into `~/.claude/skills/vibe-coding-zero-to-ship/`.

The guards can also be used on their own:

```bash
node guards/install-guards.mjs path/to/project --init
node guards/secret-scan.mjs path/to/project --history
node guards/live-check.mjs https://your-site.example
```

## Quality and testing

**Guards:** `node --test tests/guards.test.mjs` covers detection, placeholders, history scanning, the pre-commit hook blocking a real commit, and the live check against local test servers. These run in CI, and CI also scans this repository with its own secret guard.

**v0.1 results** (routing 40/40, behavior 4.588/5, E2E r2 valid with mostly ties against a strong baseline) are in [tests/QUALITY_REPORT_v0.1.md](tests/QUALITY_REPORT_v0.1.md). They were measured on the **v0.1 skill text**. v0.2 rewrote the skill, so those numbers do not carry over until re-run.

**Not yet run on v0.2:** the 40-case routing set, the new [16-case routing extension](tests/quality-routing-v0.2.csv) for v0.2's moments, the [v0.2 smoke set](tests/v0.2-smoke.md), and the [60-case beginner benchmark](tests/beginner-foundations-60.md), baseline vs skill. How to run them: [tests/README.md](tests/README.md).

## Status

v0.2 is a restructure in progress on top of v0.1.0. See [CHANGELOG.md](CHANGELOG.md).

## Influences

See `ACKNOWLEDGEMENTS.md`.

## License

MIT. See [LICENSE](LICENSE).
