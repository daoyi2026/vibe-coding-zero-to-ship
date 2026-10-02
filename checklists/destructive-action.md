# Checklist: destructive action

Use before deleting or irreversibly changing production data, infrastructure, or version history.

1. **State the consequence in plain language.**
2. **Confirm the target:** local, test/staging, or production.
3. **Determine reversibility:** backup, snapshot, export, Git checkpoint, provider recovery.
4. **Create a recovery artifact when practical.**
5. **Confirm scope:** exactly what will be deleted/rewritten.
6. **Obtain a subsequent explicit human confirmation** for materially irreversible production actions, after the scope and recovery state are known.
7. Do not execute the destructive action in the same turn as the initial request or the safety review. The original request is not final confirmation.
8. If backup or recovery cannot be verified, stop and do not execute the destructive action.
9. Execute only the subsequently confirmed action; do not bundle unrelated destructive cleanup.

Typical triggers include database deletion, bulk user-data removal, destructive migrations, production project deletion, force push/history rewrite, storage bucket deletion, or auth reset.
