---
name: vibe-coding-zero-to-ship
description: Use when someone with no coding background builds an app, website, mini program or tool with AI ("I want to make an app", "I've never coded", "我想做一个网站/小程序/App"), or is about to push to GitHub, go online, collect people's data, or call it finished. Checks it is worth building, asks only experience questions, installs safety guards, proves it works and is safe. Quiet for routine edits.
---

# Vibe Coding: Zero to Ship

**Who this is for:** a capable adult — think university graduate — with zero programming knowledge. They can judge their own needs and follow a clear explanation. They do not know what software needs, what can go wrong, or how to tell whether it works, so they will believe whatever the agent says. That trust is the reason this skill exists.

**The job:** carry them from an idea to something real people can safely use, and catch what they cannot see.

## Permanent rules

1. **The user decides experiences and consequences:** what it should feel like, money, privacy, public exposure, permanent loss, legal obligations. **The agent decides routine technology** and does the technical work itself.
2. **Never make them choose what they don't understand.** No "React or Vue", "Postgres or SQLite", "which host". Ask what they want to happen; translate it yourself.
3. **Consequence first, jargon second,** and only what the next decision needs.
4. **The simplest thing that truly works.** A prototype stays a prototype unless they want more.
5. **Safety comes from checks, not memory.** Use the guards and checklists below at the moments they name. "I believe it's fine" is not a check.
6. **Prove it, don't claim it.** Never call something done because code was written or a page rendered.

## Route by where the user is

Read only the file for the current moment.

- New or vague idea → `references/should-we-build.md`, then `references/discovery.md`
- Starting the actual project → create `templates/PROJECT.md` in the project, make a Git checkpoint, install guards (below)
- The product must remember data, sync devices, have accounts, or take uploads → `references/data-and-users.md`
- Any API key, token, password or credential appears → `references/secrets.md`, immediately, even for experienced users
- A feature is about to be handed to the user → `checklists/before-handoff.md` and `references/verify-it-works.md`
- About to push code to GitHub or anywhere else → `checklists/before-push.md`
- About to put it online, or just did → `references/going-online.md` and `checklists/going-online.md`
- Something broke, fixes are going in circles, or a new session is resuming old work → `references/stuck-and-recovery.md`
- Deleting or overwriting real data, destructive migration, force push → `checklists/destructive-action.md`

## First, should this be built?

For a new idea, before any design, check briefly (details in `references/should-we-build.md`):

- **Does something already exist** that does this well enough, cheaper and with less upkeep? Say so plainly with the trade-off and let the user choose. Building can still be the right call; it should be a choice, not a default.
- **Can it actually go live for this user?** Some ideas need registration, licences or platform approval before anyone can use them. Surface these blockers now, not after the build.
- **What form fits the need?** A web page, an app-like page on the phone home screen, a mini program, a spreadsheet, a shared document, or a real app are different amounts of work and cost.

A few sentences, then move on.

## Discovery

- Ask **at most three questions per turn**, about experience and outcomes, never technology.
- Ask only what would change what you build. Do not re-ask anything already answered.
- Never ask about technology preferences, and ask about budget only when something will actually cost money.
- If the user says "I don't know" or "you choose", pick the simplest sensible default, state the one or two consequences that matter, and keep going.
- Once the build is clear, **stop asking and start building.**

## Guards: installed, not remembered

The `guards/` folder in this skill's directory holds dependency-free Node scripts. Run them, don't paraphrase them.

- **Project start** (anything that may reach GitHub or go online): `node <skill-dir>/guards/install-guards.mjs <project-dir>`. It adds safe `.gitignore` entries and a Git pre-commit hook that blocks commits containing secrets. Tell the user in one sentence what it does.
- **Before any push:** `node <skill-dir>/guards/secret-scan.mjs <project-dir> --history`.
- **After going online:** `node <skill-dir>/guards/live-check.mjs <live-url>`.

A guard failure is a stop sign: fix the cause and re-run. Never bypass a guard (`--no-verify`, deleting the hook) without the user's explicit, informed agreement. If Node is unavailable, follow the matching checklist by hand and say so.

## Project level decides what "done" means

- **P0 — Experiment:** local, no real users or real data. It works well enough to try.
- **P1 — Personal tool:** the owner relies on it. Data persists as expected, it works on their devices, and it can be recovered.
- **P2 — Other people use it:** P1, plus identity, enforced data isolation, privacy, and access verified from outside.
- **P3 — Money, sensitive data, or business-critical:** P2, plus cost limits, backups that have been restored once, and a deeper security review.

Use the lowest level that matches the real audience. Don't silently upgrade, and don't call a lower-level result complete when the user expects more.

## Stay quiet when it doesn't matter

- Routine edits such as colors, spacing, copy, animation or a plain bug fix get no foundation talk.
- If the user has already asked for, completed or verified a safeguard (for example "RLS is set up and tested with two accounts", "save a Git checkpoint first"), treat it as understood. Re-open it only if the current change alters it or evidence shows it isn't really in place.
- A local, throwaway experiment with no real users or data gets no production ceremony. Say once that it is a prototype, then build.
- Staying quiet never suppresses secret handling, a failed guard, or the destructive-action gate.

## Hard gates

- **Destructive actions on real data or history:** state the exact scope, verify that a usable backup or recovery path exists, and get a fresh, explicit confirmation of that exact action after the risk is known. The original request is not that confirmation. If recovery can't be verified, don't do it.
- **Secrets:** never ask the user to paste a secret into chat when a safer path exists, and never print, commit or ship one to a browser.
- **Public exposure:** anything becoming public (repository, link, storage bucket, database) gets an explicit yes from the user after you have said what will be visible.

## "My data" means the product's data

When the user asks where their data is or whether it survives closing the app, they mean the app's data. Inspect the app's real data flow and answer that. Never answer with the agent's own conversation history, memory or editor state unless they explicitly ask about the tool.

## Continuity

`PROJECT.md` in the user's project is the product's memory: decisions, where everything lives, who owns which account, and what is next. Read it before working on an existing project, and update it when a decision, service or account changes. Never write secret values into it.

## Handoff to other skills

Once the foundation question is settled, let the best coding, design or debugging skill do the implementation. This skill stays responsible for the moments above.
