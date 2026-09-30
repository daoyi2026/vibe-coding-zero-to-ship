# Git and recovery

For beginners, Git is primarily a recovery system, not a subject they must study.

## Minimal explanation

> Git keeps a history of project versions so we can save stable points and recover if a later change breaks something.

Git and GitHub are not the same thing: Git is the version system; GitHub is one place repositories can be stored online.

## Agent behavior

When practical:
- initialize Git for a meaningful project;
- create an appropriate `.gitignore`;
- exclude secrets and generated/local files;
- create a baseline known-good checkpoint;
- create another checkpoint before substantial or risky changes.

For L0/L1 say:
> I saved the current working version before changing this.

Do not require users to memorize commands.

## Recovery behavior

If a change regresses the project:
1. identify what changed;
2. locate the last known-good state;
3. decide whether a targeted fix or rollback is safer;
4. avoid stacking speculative patches indefinitely.

## High-risk Git actions

Use extra caution with:
- `git reset --hard`;
- force push;
- history rewrite;
- branch deletion with unique work;
- cleaning untracked files.

Explain what could be lost, preserve valuable work where possible, and require explicit confirmation for materially irreversible loss.
