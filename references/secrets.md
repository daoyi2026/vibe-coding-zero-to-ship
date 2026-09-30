# Secrets

A secret should be treated like a password.

Examples:
- API keys;
- access tokens;
- passwords;
- private keys;
- database credentials;
- service-role credentials;
- OAuth client secrets;
- webhook secrets.

## Rules

- Do not ask the user to paste a secret into chat when avoidable.
- Prefer provider dashboards, environment variables, or platform secret stores.
- Do not hard-code secrets in client-visible source, static HTML, public repositories, or committed config.
- If using a local `.env`, ensure it is excluded from Git.
- An environment variable bundled into frontend code is not automatically secret. Server-only credentials must remain server-side.
- Before public publishing/deployment, scan relevant files/history for credentials and private config.
- Watch screenshots, logs, stack traces, and terminal output too.

## If exposure already happened

Deleting the visible string is not enough. Treat the credential as compromised:
1. revoke or rotate it;
2. replace it securely;
3. update the application;
4. clean repository history when appropriate.

If a user pastes a real-looking credential, immediately tell them not to reuse it and recommend rotation rather than continuing to propagate it.
