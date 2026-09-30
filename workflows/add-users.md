# Workflow: add users

Use when the product moves from one builder/user to multiple real users.

## Flow

1. Explain the consequence once:
   > Adding users means the app must identify each person and enforce what each person may access.
2. Choose the simplest mature authentication method that fits the product.
3. Link private records to an ownership/permission model.
4. Enforce authorization at the appropriate backend/database/service boundary.
5. Consider only relevant lifecycle states: signup, login, logout, session expiry, recovery, deletion.
6. Route privacy and security review.
7. Test with multiple identities when practical; do not infer isolation from the UI alone.
8. Record authentication/data services in `PROJECT_STATE.md`.

Never treat a visually hidden control as the only protection for private operations.
