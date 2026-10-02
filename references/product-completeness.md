# Product completeness

A happy-path screen is not automatically a complete feature.

Only check states relevant to the product; do not create ceremony for a tiny prototype.

## Common states

- default;
- loading;
- empty;
- success/feedback;
- invalid input;
- failure/error;
- network failure;
- unauthenticated;
- permission denied;
- destructive confirmation/recovery.

## Questions

- If there is no data, does the interface still make sense?
- During a slow operation, does it look frozen?
- Does the user know when save/send/upload succeeded?
- Does a failure preserve useful input and explain what happened?
- Can destructive actions be understood and recovered from when appropriate?
- Would a first-time user know what to do?
- If phones are expected, are controls readable, touch-friendly, and usable without hover?
- Has the product been checked at the device sizes the user actually expects?
- If an installable/PWA-like experience is expected, does installation, relaunch, refresh, and offline/poor-network behavior match the promise?
- If important data exists, can the user recover or export it at the level appropriate to the project?

## Completion ladder

"Done" changes with the product stage. Do not silently upgrade a project to a higher stage, and do not call a lower-stage result complete when the user's intended experience requires more.

- **P0 — Experiment complete:** the requested idea works well enough to try, with no obvious crash. Persistence, accounts, deployment, and production process are optional unless the experiment itself needs them.
- **P1 — Personal product complete:** the owner can reliably use it in the intended environment; expected data persists; relevant failure states work; intended devices are usable; there is a practical recovery path; deployment exists if remote access is part of the goal.
- **P2 — Shared product complete:** P1 plus real-user identity when needed, enforced authorization/data isolation, privacy-aware handling, account/file lifecycle, and end-to-end testing with multiple identities where relevant.
- **P3 — Production/sensitive product complete:** P2 plus proportional cost controls, operational visibility, backup/restore, higher security review, and ownership of critical services/accounts.

Use the **lowest stage that matches the user's real intended audience and consequences**.
