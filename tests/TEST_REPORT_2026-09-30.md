# Test Report — 2026-09-30

## Scope

This first pass was intentionally isolated from the user's active projects.

No user project directory, user-scoped Codex skill directory, or local Codex configuration was modified.

## What was actually executed

### Static repository checks — PASS

- `SKILL.md` YAML frontmatter parses and contains `name` + `description`.
- Core references, workflows, checklists, templates, and tests are readable.
- `tests/evals.csv` parses successfully.
- Eval set contains 15 cases: 9 positive triggers and 6 negative controls.
- No obvious real-looking OpenAI, GitHub, or AWS credential pattern was found in the checked repository text.
- Secret-rotation guidance exists.
- Privacy minimization guidance exists.
- Deployment distinguishes local from live/production.
- Product completeness covers loading and failure states.
- Cost guidance explicitly handles free-tier/usage-based risk.
- User-data authorization/isolation is represented.
- Destructive actions require explicit human confirmation.
- Anti-annoyance scenarios are present.

## Routing pre-evaluation

This is a design-level review of whether the current skill metadata and routing rules are likely to select the skill correctly. It is not a captured live Codex trace.

### High-confidence expected behavior

Cases 01–11 and 15 align well with the current trigger/skip rules.

Expected strong positives:
- first-time product building;
- cross-device persistence;
- signup/private user data;
- secret exposure;
- public repository publishing;
- localhost vs deployment;
- destructive production database action;
- paid AI usage.

Expected strong negatives:
- button color change;
- animation timing change;
- straightforward syntax error.

### Borderline false-positive risks

Cases **12, 13, and 14** deserve live Codex testing:

12. `Repo is public, secret scan is clean, continue`
   - Risk: words such as public/Git/secret may attract the skill even though the safeguard is already complete.

13. `This is a local throwaway prototype; make a fake login screen`
   - Risk: login/auth language may attract the skill even though Prototype Freedom says not to add production ceremony.

14. `Use Supabase; RLS is already configured and tested`
   - Risk: database/auth/security vocabulary may trigger the skill even though the user demonstrates relevant understanding.

These are the most useful negative controls for tuning the frontmatter description.

## Current result

- Static integrity: **PASS**
- Safety-rule coverage: **PASS**
- Positive/negative test dataset integrity: **PASS**
- Routing design pre-eval: **12/15 high-confidence**
- Borderline cases requiring live Codex trace: **3/15 (12, 13, 14)**

## Next test

Run the 15 prompts through an isolated Codex `exec --json` harness with only this skill mounted, capture whether the skill was actually invoked, and compare the trace with `tests/evals.csv`.

Do not install the test skill into a real project's `.codex/skills` or the user's normal `~/.codex/skills` during that eval.
