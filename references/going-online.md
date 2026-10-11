# Going online

Use when the user wants other people, or their own phone, to reach the product, and again right after it goes live.

## The picture a beginner needs

```
files on this computer → (optional) code copy on GitHub → hosting service → web address people open
```

These are different things. A `localhost` address only works on this computer. A GitHub repository is not the running product. "Deployed" means online. It does not mean finished or secure.

## Default: don't make the beginner run a server

Prefer managed services that handle security patches, HTTPS and basic attack protection:

- **Static or front-end only:** a static hosting platform. No server to maintain.
- **Needs data, accounts or files:** a hosted backend service (database plus auth plus storage) with front-end hosting, or a platform that runs small server functions.
- **Needs a long-running server:** a managed app platform before a raw virtual server.

Choose by current need, not popularity. A rented virtual server (VPS) means the user owns updates, firewalls, backups and break-ins. Only go there if something else truly can't do the job, and then use the hardening list below.

**Mainland China:** hosting on mainland servers with a custom domain needs ICP filing first. Overseas hosting avoids filing but may be slow or unreliable for users in China. Hosted services popular elsewhere may be unreachable. Raise this before choosing a host (see `should-we-build.md`).

## Before going online

Run `checklists/going-online.md`. The things beginners never think of:

- **Turn off development features:** debug mode, detailed error pages, test or seed endpoints, sample admin accounts, default passwords, "temporary" open access rules.
- **Close what shouldn't be reachable:** admin pages and APIs behind real authentication; databases not directly reachable from the internet unless their access rules are verified; no `.env`, `.git`, backup files or source maps served publicly.
- **Secrets on the server side only:** run `guards/secret-scan.mjs`. Production secrets go in the host's secret settings.
- **Cost exposure:**
  - a free tier does not mean it can't charge
  - set spending limits or alerts where the provider allows
  - anything public that calls a paid service (AI, SMS, maps, email) needs rate limits or sign-in, or a stranger or a bot can run up the bill overnight
- **Accounts in the user's name:** the hosting, domain, database and payment accounts should belong to the user (or their business), with 2FA turned on. A helper's personal account is a future lockout.

The user does the parts that need their identity: creating accounts, 2FA, payment details, entering production secrets in the provider's dashboard. The agent does the rest.

## After going online

1. Run `node <skill-dir>/guards/live-check.mjs <url>` and fix everything it reports.
2. Test the real address, not localhost, on the devices the user expects (usually a phone): main journey, saving and reloading data, sign-in, and for P2+ the outside-access checks in `verify-it-works.md`.
3. Tell the user plainly whether the address is public or restricted, and who can see what.
4. Record the URL, host, services, which accounts own them, and what can charge money in `PROJECT.md`.

## If a VPS is unavoidable: minimum hardening

- automatic security updates on
- SSH with keys only; password login and root login disabled
- firewall open only for the ports actually needed (usually 80/443 and SSH)
- databases and admin panels bound to localhost or a private network, never the public internet
- the app runs as a non-root user behind HTTPS
- automatic backups of data, with one restore actually tried
- tell the user this server is now theirs to maintain, and what that means monthly

## Afterwards

A live product needs an owner. At P1+ make sure `PROJECT.md` says where code, the live app, data, files and secrets live, which services can charge, renewal dates (domain, certificates if not automatic), and how to roll back. For P3, check that backups exist and that one restore was actually tried.
