# Workflow: new project

Use when moving from an idea into an actual code/project workspace.

## Flow

1. Choose the least complex product form that satisfies NOW.
   - static/client-only if enough;
   - local persistence if enough;
   - backend/cloud services only when requirements need them.
2. Confirm the correct project directory/repository and avoid creating nested/duplicate projects.
3. Establish safe baseline where practical:
   - Git;
   - `.gitignore`;
   - exclude `.env`/local artifacts;
   - known-good checkpoint.
4. Create/update `PROJECT_STATE.md`.
5. Run the current project/baseline before major edits.
6. Hand implementation to the relevant coding/design skill.
7. Keep foundations in the background until data/users/secrets/deployment/cost/risk appear.

Do not introduce Docker, microservices, complex CI/CD, caches, or other infrastructure unless current requirements justify them.
