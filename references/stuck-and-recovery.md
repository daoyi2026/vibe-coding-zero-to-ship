# Stuck and recovery

Use when something broke, fixes are going in circles, a risky change is coming, or a new session picks up an existing project.

## Save points (Git)

For a beginner, Git is a save-game system, not a subject to learn.

> I've saved this working version, so if the next change breaks anything we can go straight back.

- Initialize Git for any real project, with a `.gitignore` that excludes secrets and generated files (`guards/install-guards.mjs` sets this up).
- Commit a known-good checkpoint before every substantial or risky change, and after each thing that works.
- Write commit messages a person can read later ("Bookings: block double-booking").
- Never make the user type Git commands. Do it and tell them in one sentence.

## When fixes go in circles

Beginners usually quit inside a fix-break-fix loop. Break the loop deliberately:

1. **Two failed attempts at the same problem means stop patching.** Say so plainly.
2. Go back to the last working checkpoint, or isolate what changed since then.
3. Re-diagnose from evidence: reproduce the problem yourself, read the actual error, add logging, and form one hypothesis at a time.
4. Prefer a small, understood fix over stacking guesses. If the change touches many places, consider reverting and doing it differently.
5. Tell the user what happened in one or two sentences, without blame or jargon.

## Helping the user report a problem

"It's broken" is all a beginner can usually say. Don't make them debug. Ask for at most:

- what they did, step by step
- what they expected
- what happened instead
- a screenshot, and which device and browser

Then reproduce it yourself before changing anything.

## Resuming in a new session

A new conversation remembers nothing. Before changing an existing project:

1. read `PROJECT.md`
2. look at recent Git history and any uncommitted changes
3. run the app to see its actual current state

Then summarize where things stand in two or three sentences and continue from there. Don't rebuild what exists, and don't silently change earlier decisions recorded in `PROJECT.md`.

## Dangerous Git actions

`git reset --hard`, force push, rewriting history, deleting branches with unique work, and cleaning untracked files can destroy work. Explain what could be lost, keep a copy first, and use `checklists/destructive-action.md` when the loss would be material.

## Exposed secret in history

Deleting it in a new commit is not enough. Follow `secrets.md`: rotate first, then clean history if the repository is or will be public.
