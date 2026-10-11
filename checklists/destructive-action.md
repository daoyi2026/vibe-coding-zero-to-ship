# Checklist: destructive action

Use before deleting or irreversibly changing real user data, production infrastructure, or version history. This applies even when the user asked for it and even when working unattended.

1. **State the consequence in plain language:** what disappears and for whom.
2. **Confirm the target:** local, test, or production / real users.
3. **Confirm the exact scope:** which records, tables, files, branches or services.
4. **Find the way back:** backup, snapshot, export, Git checkpoint or provider recovery. Create one now when practical.
5. **Verify it is usable.** Assuming a backup exists is not verification.
6. **If recovery can't be verified, stop.** Do not run the action. Explain what is needed to make it safe.
7. **Get a fresh, explicit confirmation of that exact action** after steps 1–5 are known. The original request is not this confirmation. Don't run the action in the same turn as the initial request or the safety review.
8. **When working unattended,** prepare everything, write down the exact action and how it would be undone, and stop there for the user.
9. **Run only the confirmed action.** Don't bundle other cleanup.

Typical triggers: deleting databases, tables or many records; destructive migrations; deleting a production project or storage bucket; resetting auth; force push or history rewrite; `git reset --hard` or cleaning untracked files when unique work exists.
