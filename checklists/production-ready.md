# Checklist: production ready

Use for P2/P3 real-user launches. Omit irrelevant items.

## Product
- [ ] Core user goal works end-to-end.
- [ ] First-time user can understand what to do.
- [ ] Relevant loading, empty, invalid, and failure states exist.
- [ ] Destructive actions communicate consequences.

## Data/users
- [ ] Persistence matches user expectations.
- [ ] Signup/login/logout/recovery work when required.
- [ ] Private user records are isolated by enforced permissions.
- [ ] File storage and deletion behavior are understood.

## Security/privacy
- [ ] No known exposed secrets.
- [ ] Restricted operations are not protected only by frontend UI.
- [ ] Relevant public input is validated/protected.
- [ ] Data collection/visibility/third-party sharing are understood.
- [ ] Major risk areas received appropriate deeper review.

## Deployment/operations
- [ ] Production configuration and URL are correct.
- [ ] Paid/usage-based services and cost drivers are known.
- [ ] Code, deployment, data, secret-store locations, and account ownership are documented.
- [ ] Recovery/backup/logging needs are addressed proportionally to risk.
