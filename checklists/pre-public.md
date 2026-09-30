# Checklist: pre-public

Use before making a repository, endpoint, bucket, or product surface publicly visible.

## Visibility
- [ ] Public visibility is actually intended.
- [ ] The user understands what becomes accessible.

## Secrets
- [ ] No API keys, tokens, passwords, private keys, service credentials, or private certificates in tracked/public files.
- [ ] `.env` and local secret files are excluded.
- [ ] Example config uses placeholders.
- [ ] Relevant logs/screenshots do not expose secrets.

## Private content
- [ ] No accidental personal documents or private datasets.
- [ ] No private screenshots/configuration that should not be shared.

## History
- [ ] If a secret was previously committed/exposed, it has been revoked/rotated; deletion alone is not treated as remediation.

Proceed only after material exposure risks are resolved.
