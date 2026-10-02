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

## By project level

- **P0:** core requested behavior and no obvious crash may be enough.
- **P1:** add persistence, basic failure handling, recovery, and intended deployment.
- **P2:** add account states, authorization, user-data isolation, privacy-related behavior.
- **P3:** add payment/billing failure, operational monitoring, backup/recovery, and higher security scrutiny.
