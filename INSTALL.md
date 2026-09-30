# Installation

You do **not** need to learn Git just to install this skill.

## Easiest option: ask your coding agent

Paste this into Codex or another coding agent that can work with files:

> Install the Agent Skill from `https://github.com/daoyi2026/vibe-coding-zero-to-ship` into my user-level skills directory as `vibe-coding-zero-to-ship`. Do not overwrite an existing installation without asking me first. Verify that the installed folder contains `SKILL.md`.

For Codex, use:

```text
~/.codex/skills/vibe-coding-zero-to-ship/
```

For Cursor, a native user-level location is:

```text
~/.cursor/skills/vibe-coding-zero-to-ship/
```

Cursor also recognizes Codex skill directories, so an existing Codex installation can be discovered by Cursor as well.

## Safe installer for macOS / Linux

If you downloaded or cloned this repository, run from the repository root:

```bash
bash scripts/install.sh
```

The default target is Codex. For Cursor:

```bash
bash scripts/install.sh --target cursor
```

For the vendor-neutral Agents directory:

```bash
bash scripts/install.sh --target agents
```

### Updating

The installer deliberately refuses to overwrite an existing installation.

To update:

```bash
bash scripts/install.sh --update
```

Before replacing anything, it creates a timestamped backup next to the existing skill.

## Manual installation

1. Download the repository ZIP from GitHub.
2. Extract it.
3. Copy the folder into the desired skills directory.
4. Make sure the final structure looks like:

```text
~/.codex/skills/
└── vibe-coding-zero-to-ship/
    ├── SKILL.md
    ├── references/
    ├── workflows/
    ├── checklists/
    └── templates/
```

Only those runtime files are needed. The `tests/` and `.github/` directories are for development of the skill itself.

## Safety notes

- Do not paste API keys or account passwords into installation commands.
- The installer does not ask for credentials.
- The installer does not modify an active project.
- Existing installations are never overwritten silently.
- Review third-party scripts before running them if you did not get them from a source you trust.
