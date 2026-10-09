# Checklist: before push

Use before pushing code to GitHub or any other remote, and before changing a repository's visibility.

The agent does these checks itself. Ask the user only about visibility.

- [ ] **Why push?** Backup, deployment, collaboration or sharing. That decides visibility.
- [ ] **Visibility:** private by default. If public, the user has said yes after being told "anyone on the internet can read every file and every past version".
- [ ] **Secret scan passed:** `node <skill-dir>/guards/secret-scan.mjs <project-dir> --history`. Use `--history` on the first push to a new remote, and always before going public.
- [ ] **Ignored files:** `.env`, local databases, uploads, logs, build output and editor files are in `.gitignore` and not tracked (`git ls-files` shows none of them).
- [ ] **No private content:** no personal documents, customer data exports, real photos, screenshots with private information, or private keys.
- [ ] **Examples use placeholders:** `.env.example` and docs contain fake values only.
- [ ] **Pre-commit guard installed** (`guards/install-guards.mjs`), so later commits stay protected.
- [ ] **Right remote:** pushing to the intended repository, not a duplicate or someone else's.
- [ ] **If a secret was ever committed:** it has been rotated at the provider (see `references/secrets.md`). Removing it from the latest version is not enough.

After pushing, tell the user where the repository is and whether it is public or private.
