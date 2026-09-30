# Workflow: add data

Use when the product must remember, sync, or store user/application information.

## Flow

1. Determine expected behavior:
   - survive refresh?
   - survive browser close?
   - sync across devices?
   - separate data per user?
   - uploaded files?
2. Choose the simplest matching storage:
   - temporary state;
   - browser/local storage;
   - cloud database;
   - object/file storage.
3. Explain the decision in one practical sentence for beginners.
4. Define the smallest useful data shape in product terms.
5. Check sensitivity/privacy implications.
6. Implement with the appropriate coding skill.
7. Verify the actual behavior:
   - save;
   - refresh/reopen as relevant;
   - retrieve;
   - update/delete as relevant;
   - cross-device/user isolation if required.
8. Record the storage location/service in `PROJECT_STATE.md`.

Do not add a database merely because the user said “app”.
