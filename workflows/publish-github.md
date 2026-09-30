# Workflow: publish to GitHub

Use when the user wants to create/connect/push a repository.

## Flow

1. Determine why GitHub is needed: recovery, deployment, collaboration, open source, or sharing.
2. Inspect whether a repository/remote already exists and avoid duplicates.
3. Ensure Git hygiene and a sensible checkpoint.
4. Scan relevant files for secrets, `.env`, credentials, private files, generated junk, and local-only config.
5. Determine visibility.
   - For beginners, prefer private unless public is actually useful/required.
   - If public, state plainly that repository files can be viewed by anyone.
6. If public, run `../checklists/pre-public.md`.
7. Push using the agent/tooling when possible.
8. Confirm repository location and visibility.

If a credential was previously exposed, rotate it; simply removing the current line is insufficient.
