# Maintenance

Deployment is not the end of ownership.

## Lightweight ownership map

For a live product, keep enough information to answer:

- Where does the code live?
- Where does the live app run?
- Where does user/app data live?
- Where do uploaded files live?
- Where are secrets stored? (location only, never secret values)
- Which external services are used?
- Which services can charge money?
- Who owns the important accounts?
- What is the recovery path?

Use `templates/PROJECT_STATE.md` rather than relying on memory.

## Operations

Depending on project level, consider:
- domain renewal;
- hosting/runtime;
- database/storage limits;
- API quotas;
- backups;
- logs/errors;
- dependency/security updates;
- user support.

Do not impose enterprise observability on a small personal tool.

If data matters, verify that a backup exists before claiming the product is backed up, and know how restoration would work.
