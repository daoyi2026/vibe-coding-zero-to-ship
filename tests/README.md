# Testing this skill

The repository includes both static scenarios and a live Codex routing harness.

## Isolation

The live runner does **not** install this skill into your normal user skill directory and does not open an active project.

For each run it creates a temporary scratch tree and mounts only this repository's skill as a repo-scoped skill:

```text
<temp>/
├── codex-home/
└── case-XX/
    └── .codex/
        └── skills/
            └── vibe-coding-zero-to-ship/
```

Each prompt gets its own scratch project. Codex is launched with a temporary `CODEX_HOME` and read-only sandbox mode.

## Run

From the repository root:

```bash
node tests/run-codex-evals.mjs
```

Run only the three important negative controls:

```bash
node tests/run-codex-evals.mjs 12 13 14
```

## Authentication

The temporary `CODEX_HOME` prevents normal user config and user-scoped skills from contaminating the routing test.

The runner does not copy `auth.json` or any credential into the scratch directory. Authentication must therefore already be available through a supported non-file mechanism, such as a keychain-backed Codex session or `CODEX_ACCESS_TOKEN`.

If authentication is unavailable, the Codex subprocess exits non-zero and the per-case stderr explains the failure.

## Artifacts

By default the scratch tree is deleted when the process exits.

To preserve traces temporarily:

```bash
KEEP_EVAL_ARTIFACTS=1 node tests/run-codex-evals.mjs
```

The runner prints the temporary path.

Review traces before sharing them.

## Grading

The deterministic grader searches the JSONL trace for evidence that Codex read this skill or one of its supporting files.

If a future Codex version changes how skill reads appear in JSONL, a false `detected=false` can mean the grader needs updating rather than the skill failed to route. Inspect the JSONL in that case.

The dataset intentionally contains both positive and negative cases. A foundation skill that triggers on every adjacent coding task is not a successful skill.
