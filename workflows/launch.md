# Workflow: launch

Use when a deployed product is about to be used by its intended real audience.

## Flow

1. Identify intended audience: owner only, testers, public users, paying users.
2. Apply readiness proportional to P0–P3.
3. Test the main user journey end-to-end instead of isolated buttons.
4. Check the first-time experience and relevant loading/empty/error states.
5. Confirm ownership and cost of hosting, domain, database/storage, APIs, auth, and payment services.
6. Define a minimum recovery path: logs/error visibility, known-good code state, rollback, and data backup when needed.
7. Run `../checklists/production-ready.md` for P2/P3.
8. Call it launched only when the intended audience can actually reach and use it.

A successful build is not a launch.
