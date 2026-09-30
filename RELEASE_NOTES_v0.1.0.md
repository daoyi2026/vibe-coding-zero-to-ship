# v0.1.0 Release Notes

## Vibe Coding: Zero to Ship

A foundation skill for people who can describe what they want to build but may not yet know the software-development concepts that advanced coding workflows assume.

### What this release covers

- What happens to data after a page closes.
- When local storage is enough and when cloud persistence is needed.
- Git as a recovery mechanism rather than a prerequisite course.
- GitHub public/private visibility.
- API keys and secrets.
- Login versus authorization.
- User-data isolation.
- Localhost versus a deployed product.
- Basic product states such as loading, empty, success, and failure.
- Cost awareness for hosting, APIs, storage, AI, and other external services.
- Production ownership, backups, and maintenance.

### The core behavior

The skill should intervene when a missing foundation changes the next decision or creates real risk.

It should stay quiet for ordinary edits, harmless prototypes, and concepts the user already understands.

### Safety

The repository includes:

- pre-public checks;
- secret handling guidance;
- destructive-action gates;
- project recovery/checkpoint guidance;
- production readiness checks;
- a safe installer that refuses silent overwrite.

### Testing

The repository contains 15 routing scenarios with both positive and negative controls, static structure validation, secret-pattern checks, and installer smoke tests.

### Installation

See `INSTALL.md`.

### License

MIT.
