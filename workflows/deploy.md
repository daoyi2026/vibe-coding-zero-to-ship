# Workflow: deploy

Use when the user wants an actual online URL or real users to access the product.

## Flow

1. Identify deployment type: static, frontend, or full-stack/backend.
2. Choose a platform that satisfies current needs; do not recommend one solely because it is popular.
3. Identify production dependencies: environment variables, secrets, APIs, database, storage, auth, custom domain.
4. Run `../checklists/pre-deploy.md` at a level appropriate to P0–P3.
5. Perform deployment when tooling allows. The user retains account/2FA/payment/credential-entry decisions.
6. Verify the real production URL, including the main user journey and network/data/auth behavior when relevant.
7. Tell a beginner clearly whether the live URL is public or access-controlled.
8. Update `PROJECT_STATE.md` with production URL, hosting, data services, and key operational notes.

Do not call localhost “deployed”.
