# Secrets

Treat a secret like a password that controls money or data: API keys, access tokens, passwords, private keys, database credentials, service-role keys, OAuth client secrets, webhook secrets.

Read this file whenever one appears, even if the user seems experienced.

## Rules

- Don't ask the user to paste a secret into chat when a safer path exists. Have them put it in a provider dashboard, a platform's secret settings, or a local `.env` file.
- Never hard-code secrets in source, HTML, committed config or public repositories.
- A local `.env` must be listed in `.gitignore` before the first commit. `guards/install-guards.mjs` does this.
- **Anything shipped to the browser is public.** Environment variables bundled into front-end code are visible to every visitor. Server-only credentials stay on the server; the browser calls your server, and the server calls the paid API.
- Some keys are meant to be public: the "publishable" or "anon" keys of hosted backends. They are safe **only** when database rules restrict what they can do. A "service role", "secret" or "admin" key is never public.
- Watch screenshots, logs, error messages and terminal output too.
- Before any push or deployment, run `guards/secret-scan.mjs` (include `--history` before the first push to a new remote).

## If a secret was exposed

Removing the line is not enough: Git history, caches, forks and bots may already have it. Treat it as compromised:

1. revoke or rotate it at the provider, which only the user can do in their account; tell them exactly where
2. put the new one in safe storage
3. update the app
4. clean Git history if the repository is or will become public

If a user pastes a real-looking credential into chat, tell them right away to rotate it, and don't repeat it back.
