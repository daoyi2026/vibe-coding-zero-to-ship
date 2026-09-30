# v0.1.0 — First public release

## Vibe Coding: Zero to Ship

This project started from a simple problem: AI coding tools are getting better, but a lot of the advice around them still assumes you already understand how software works.

If you are new to coding, that gap shows up quickly.

You may know exactly what you want to build, but not yet know what happens to data after you close the browser, why Git matters, whether an API key is safe to put in the frontend, or what the difference is between “login works” and “users can only see their own data”.

This skill is meant to fill that gap.

It does not try to teach programming from scratch. It gives an AI coding agent enough structure to notice the important things a beginner may not know to ask about, explain only what matters for the current decision, and keep the build moving.

## What v0.1.0 covers

The first release focuses on the foundations that most often get skipped in beginner AI-assisted projects:

- data persistence and where user data actually lives;
- Git and recovery, explained as a safety net rather than a course;
- public vs private GitHub repositories;
- API keys, secrets, and credentials;
- login, permissions, and user-data isolation;
- localhost vs a real deployed product;
- loading, empty, success, and failure states;
- cost risks from hosting, storage, APIs, and AI usage;
- backups, ownership, and what happens after the product goes live.

## A principle that matters

The skill is not supposed to interrupt every coding task.

If the user asks to make a button green, it should not suddenly explain Git.

If someone is building a throwaway local prototype, it should not force production-grade architecture.

If the user has already shown that they understand the relevant risk and have the right safeguard in place, the skill should stay out of the way.

It should step in only when a missing foundation changes the next decision or creates a real risk.

## Safety and recovery

v0.1.0 includes practical checks for:

- publishing a repository;
- handling secrets;
- destructive actions;
- production readiness;
- recovery checkpoints;
- deployment;
- user data and permissions.

The installer also refuses to silently overwrite an existing copy of the skill. An explicit update creates a backup first.

## Testing

The repository currently includes 15 routing scenarios with both positive and negative controls, plus:

- static structure validation;
- secret-pattern checks;
- installer syntax checks;
- installer smoke tests for first install, overwrite protection, and backup-before-update.

Live Codex routing traces are not part of the default CI yet, because the project intentionally does not require or store OpenAI credentials just to run its test suite.

## Installation

See [INSTALL.md](INSTALL.md).

## License

MIT.
