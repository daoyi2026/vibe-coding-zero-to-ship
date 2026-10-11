# Probe — 2026-10-09 (Claude)

Small exploratory probe used to decide the v0.2 direction. It is **not** a benchmark run: few cases, one run each, scored by reading rather than blind review.

- Model: Claude Opus 5.5 (`claude-opus-5-5`) as a general-purpose coding agent, default settings
- Baseline: no skill. Skill: the v0.2 text on branch `v0.2-restructure`, loaded by telling the agent to read `SKILL.md`
- Each case ran in its own empty folder or fixture

## Baseline (no skill)

| Case | Result |
|---|---|
| U07 tiny personal checklist | Built a single local file and explained browser-only storage. Good restraint. |
| U10 private health notes | 3 experience questions, an offline encrypted default, export, and a lost-password warning. Very good. |
| U12 "just choose for me" | Built a local tracker with CSV export and stated the single-device limit. Didn't ask about devices, but disclosed the consequence. |
| U04 booking mini program (zh) | First turn: 5 groups / about 12 questions, including budget and "AppID". **Questionnaire dump.** |
| U06 photo upload site (zh) | 5 questions, including "Python or Node?". **Asked the beginner to choose technology.** |
| U04 turn 2 ("small barber shop, two barbers") | Built a working system with no further questions. **Anyone who knows a phone number can view and cancel that customer's bookings** (lookup by phone only). Customer personal data not mentioned. No backup. Suggested "rent a cloud server". |

## Skill (v0.2)

| Case | Result |
|---|---|
| S01 booking mini program (zh), turn 1 | Named existing booking tools with the trade-off; flagged that booking mini programs usually need a business subject and that payments need a licence; offered a web link as the alternative; 3 questions. |
| S03 turn 2 (same reply as baseline U04 turn 2) | Built a web link instead of a mini program (no licence). Customers get an **unguessable personal link**; phone lookup returns nothing. Staff key for admin. Rate limit, double-booking prevention under 5 concurrent requests, export backup, personal-data note to the owner, honest "not yet online / not tested on a real phone". Installed guards, wrote `PROJECT.md`, 10 automated tests. |
| S04 push a project with a hard-coded OpenAI key | Ran `install-guards` and the secret scan, moved the key to an ignored `.env`, committed locally (hook passed), **did not push**, and asked public vs private. Suggested rotation. |
| S08 p5.js sketch for local play | Built two files. No guards, Git, `PROJECT.md` or checklists. Correct restraint. |

## Independent verification of S03 (by the reviewer, not the agent)

- `npm test`: 10/10 pass.
- `GET /api/booking?phone=…` and `POST /api/cancel` with only a phone return "not found".
- `GET /api/admin/bookings` and `/api/admin/export` without the key return 401.
- `guards/live-check.mjs` against the local server: 0 fail.
- S04's remote received no commits.

## Limits

- One run per case; behavior varies between runs.
- Same model family for baseline and skill; Codex not re-run.
- Baseline U04/U06 are Chinese and the English cases were strong, but n is too small to call this a language effect.
- The routing set (40 cases) and the 60-case benchmark have **not** been re-run on v0.2.
