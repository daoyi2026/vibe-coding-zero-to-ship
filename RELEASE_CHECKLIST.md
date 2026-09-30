# Release Checklist

Use this before publishing a tagged release.

## Repository

- [x] `SKILL.md` has valid frontmatter.
- [x] Skill description is concise and includes skip conditions.
- [x] All routed reference/workflow/checklist files exist.
- [x] README explains purpose and installation.
- [x] INSTALL.md provides beginner-friendly installation.
- [x] MIT LICENSE exists.
- [x] ACKNOWLEDGEMENTS.md exists.

## Safety

- [x] No obvious committed API keys/tokens detected by static validator.
- [x] Installer refuses silent overwrite.
- [x] Installer makes a backup before explicit update.
- [x] Default CI requires no OpenAI credential.
- [x] Destructive actions require explicit human confirmation.

## Tests

- [x] Positive routing cases exist.
- [x] Negative routing controls exist.
- [x] Static validator passes on the final release-candidate commit.
- [x] Installer syntax check passes.
- [x] Installer smoke test passes on the final release-candidate commit.
- [ ] Live Codex routing traces completed in a deliberately authenticated isolated environment.

The unchecked live-routing item is non-blocking for v0.1.0 because the release does not claim measured live routing accuracy.

## Release

- [x] `CHANGELOG.md` contains v0.1.0 entry.
- [x] `RELEASE_NOTES_v0.1.0.md` prepared.
- [x] Create Git tag `v0.1.0`.
- [x] Create GitHub Release using `RELEASE_NOTES_v0.1.0.md`.
