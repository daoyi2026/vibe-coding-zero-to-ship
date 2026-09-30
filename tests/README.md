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

## Authentication and Plus accounts

The temporary `CODEX_HOME` prevents normal user config, user-scoped skills, and active-project settings from contaminating the routing test.

That strong isolation also means the runner deliberately does **not** reuse or copy the normal `~/.codex` authentication files.

The default GitHub Actions workflow therefore runs **static validation only** and requires no OpenAI credential.

For ChatGPT Business or Enterprise workspaces, a dedicated `CODEX_ACCESS_TOKEN` can be supplied manually to a compatible local/CI setup. Codex access tokens are not currently a ChatGPT Plus feature.

If you use ChatGPT Plus, do not copy `auth.json` into a test directory just to make this harness work. Keep using the credential-free static suite until a deliberately isolated Plus-compatible live harness is configured.

If a live run has no supported authentication path, Codex exits non-zero; that is an environment limitation, not a routing result.

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
