# Security routing

This file decides when normal product work requires stronger security scrutiny. It is not a guarantee of security.

## Escalation signals

Increase attention when adding:
- authentication;
- private user data;
- databases reachable through public clients;
- file uploads;
- admin roles;
- payments;
- API keys/server secrets;
- public forms/APIs;
- webhooks;
- AI endpoints;
- sensitive information.

## Risk levels

**Low:** static/local projects. Check accidental secrets and safe publishing.

**Medium:** personal cloud or shared apps. Add authentication/authorization review, user-data isolation, input validation, privacy, and abuse/rate controls when relevant.

**High:** payments, sensitive data, admin control, large datasets, or business-critical use. Require stronger review and do not imply checklist completion proves the system secure.

## Rules

- Browser/UI checks are not sufficient authorization for restricted operations.
- Treat user-controlled inputs as untrusted at the appropriate boundary.
- Prefer mature platform protections over hand-rolled security.
- Do not add unnecessary dependencies; each dependency increases maintenance and attack surface.
- When a dedicated security skill/tool is available, hand off the deep audit after foundations identifies the risk.
