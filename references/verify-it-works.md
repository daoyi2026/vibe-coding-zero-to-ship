# Verify it works

Use before telling the user something is finished, and before anything goes to real users.

A beginner cannot tell whether the agent's work is right. They will believe "done". So "done" must mean: **the agent ran it, tried to break it, and can say exactly what was and wasn't checked.**

## 1. Run it for real

- Start the app the way the user will use it, not just compile or lint.
- Do the main journey end to end, the way the user described it.
- Use a browser or automated browser test when the product is a page; check at phone size when phones matter.
- Refresh and reopen: is data that should persist still there?

## 2. Try the obvious failures

Check only the ones relevant to this product:

- empty state: first use, no data yet
- invalid input: blank fields, nonsense, very long text, wrong file type, huge file
- failure: network off, the outside service failing, a slow response. Nothing should freeze or lose what the user typed.
- double actions: clicking submit twice; two people booking the same slot
- destructive actions: they say what will happen, and can be undone or confirmed

## 3. For anything with other people's data (P2+): try to get in from outside

Check that the protection **works**, not just that it exists. Platforms have shipped "security scans" that only checked whether access rules existed, and hundreds of apps were readable by anyone.

- **Second identity:** create user B and try to read, change and delete user A's records through the UI **and** by calling the API directly.
- **Signed out:** call every API route and data endpoint without signing in.
- **Guess or swap identifiers:** change IDs in URLs and requests; type someone else's phone number or email where the app looks things up.
- **Direct database access:** if the browser holds a public database key, query each table with only that key. Every private table must refuse.
- **Admin:** admin pages and actions refuse non-admins, with no default password.
- **Live site:** run `guards/live-check.mjs` on the real address.

Any success here is a stop: fix it, then re-run the same attempt.

## 4. Match the project level

- **P0:** the idea works well enough to try, with no obvious crash.
- **P1:** the owner can rely on it on their real devices; data persists as expected; relevant failures are handled; there is a recovery path (export, backup or Git).
- **P2:** P1, plus identity, enforced isolation verified by step 3, privacy handled, and account and file lifecycle.
- **P3:** P2, plus cost limits, backups with one restore actually tried, error visibility, and a deeper security review.

## 5. Report honestly

Tell the user, briefly:

- **what you checked and how** ("I signed up as two people; person B couldn't see person A's notes, even by calling the server directly")
- **what you could not check** ("I haven't opened it on a real iPhone")
- **two or three things they should try themselves**, as concrete steps ("Open the link on your phone, add an expense, close the browser, open it again: it should still be there")

Never say "should work" about something you could have run.
