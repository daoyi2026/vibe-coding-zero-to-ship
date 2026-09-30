# Authentication and users

Adding users changes more than the login screen.

## Core distinction

- **Authentication:** who is this person?
- **Authorization:** what may this person see or change?

Login does not automatically make data private.

## Activate for

Signup, login, profiles, private user records, teams/roles, admin areas, password recovery, or account deletion.

## Minimum reasoning

- Choose a mature authentication provider/library rather than inventing password storage without a strong reason.
- Never store or log plaintext passwords.
- Connect private records to an ownership model.
- Enforce sensitive permissions at an appropriate server/database/service layer, not only by hiding UI.
- Verify that User A cannot access User B's private records.
- Consider relevant account lifecycle states: signup, login, logout, session expiry, recovery, deletion.
- Define admin privileges narrowly.

If real users exist, route privacy and security checks too.
