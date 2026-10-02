# Workflow: new project

Use when moving from an idea into an actual code/project workspace.

## Flow

1. Read or create `PRODUCT.md` from the discovery decisions already made.
2. Treat those decisions as implementation constraints until the user changes them.
   - mobile-first means build and verify mobile-first from the start;
   - cross-device persistence means do not choose page-memory-only storage;
   - private multi-user data means ownership/authorization is part of the architecture;
   - offline expectations must influence data flow before the UI is considered complete.
3. Choose the least complex product form that satisfies NOW.
   - static/client-only if enough;
   - local persistence if enough;
   - backend/cloud services only when requirements need them.
4. Confirm the correct project directory/repository and avoid creating nested/duplicate projects.
5. Establish safe baseline where practical:
   - Git;
   - `.gitignore`;
   - exclude `.env`/local artifacts;
   - known-good checkpoint.
6. Create/update `PROJECT_STATE.md`.
7. Run the current project/baseline before major edits.
8. Hand implementation to the relevant coding/design skill.
9. Keep foundation teaching in the background, but continue honoring already-discovered product constraints. Re-open discovery only when a new architecture-changing unknown appears.

Do not introduce Docker, microservices, complex CI/CD, caches, or other infrastructure unless current requirements justify them.
