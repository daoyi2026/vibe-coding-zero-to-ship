# Checklist: going online

Use before deploying to a public address, and again right after. Apply in proportion to the project level.

## Before

- [ ] **Blockers cleared:** filing, platform approval or business requirements for this region and form (see `references/should-we-build.md`).
- [ ] **Host fits:** managed hosting unless a server is truly required (see `references/going-online.md`).
- [ ] **Development features off:** debug mode, verbose error pages, test or seed endpoints, sample accounts, default passwords, temporarily open access rules.
- [ ] **Secrets:** `guards/secret-scan.mjs` passes. Production secrets are in the host's secret settings, not in files. No server-only key in front-end code.
- [ ] **Exposure:** admin pages and APIs require authentication. The database isn't reachable from the internet except through verified access rules. No `.env`, `.git`, backups or source maps served.
- [ ] **Data:** production uses its own database and storage, not development data. Migrations that destroy data went through `destructive-action.md`.
- [ ] **Cost:** every paid or usage-based service is listed; spending limits or alerts are set where available; public paid features are rate-limited.
- [ ] **Ownership:** accounts for hosting, domain, database and payments belong to the user or their business, with 2FA on.
- [ ] **Way back:** a Git checkpoint of the deployed version exists, and rollback is understood.

## After

- [ ] `node <skill-dir>/guards/live-check.mjs <url>` passes, or every finding is fixed or knowingly accepted.
- [ ] The main journey works on the real address and on the user's real device type.
- [ ] Data saves and reloads in production.
- [ ] For P2+: the outside-access attempts in `references/verify-it-works.md` fail on the live site.
- [ ] The user knows whether the address is public, who can see what, and what can cost money.
- [ ] `PROJECT.md` records the URL, host, services, account owners, renewal dates and rollback steps.

Only call it launched when the intended people can actually reach and use it.
