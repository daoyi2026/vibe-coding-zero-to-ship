# Checklist: pre-deploy

Apply proportionally to project level.

## Build
- [ ] Production build/runtime starts successfully.
- [ ] No known blocking runtime error.
- [ ] Main intended flow works.

## Environment
- [ ] Required production environment variables exist.
- [ ] Secrets use appropriate secret storage.
- [ ] Development URLs/services are not accidentally used in production.

## Access/data
- [ ] Public/private access matches intent.
- [ ] Data reads/writes work where relevant.
- [ ] User-data isolation/permissions are correct where relevant.
- [ ] Migration/destructive data risk has been considered.

## Experience
- [ ] Relevant loading/empty/error/auth states do not dead-end the user.
- [ ] Mobile behavior checked when mobile use is intended.

## Cost/recovery
- [ ] Usage-based/paid services are known.
- [ ] A known-good code state exists.
- [ ] Rollback or recovery is understood where practical.
