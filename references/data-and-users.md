# Data and users

Use when the product must remember information, sync across devices, have more than one user, accept uploads, or hold information about real people.

## Choose storage by expected behavior

Decide what the product must remember first, in product terms. Then pick the simplest storage that does what the user expects:

| The user expects | Simplest fit | Say it like |
|---|---|---|
| Only while the page is open | page memory | "Gone when you refresh." |
| Survives closing, same device | browser storage | "Like a notebook inside this browser on this device. Clearing browser data or switching devices loses it unless you export." |
| Same data on several devices, or several people | online database | "Kept on an online service, so any of your devices can reach it." |
| Photos, documents, audio, video | file storage, plus records pointing to the files | "An online folder built for files." |

For browser-only storage that matters to the user, add an export or backup, and tell them the data lives in this browser only.

Misconceptions to correct when they come up:
- seeing data on screen does not mean it is saved
- code on GitHub does not hold the app's user data
- a login screen does not make data private

Don't add a database just because the user said "app".

## Identity: who is this person?

Use a mature, well-known sign-in method (a hosted auth service or a well-established library). Never invent password storage, and never store or log passwords.

**Something anyone can type is not identity.** A phone number, email address, name or order number typed into a box proves nothing: anyone who knows it can type it. Proof means something only that person has:
- a real login
- a one-time code sent to their phone or email
- a long, unguessable secret link

Agents commonly take the shortcut of "look up my bookings by phone number" when building quickly. It lets strangers read and cancel other people's records. Don't ship it.

## Permission: what may this person see or change?

Signing in tells you **who** someone is; it does not limit **what** they can reach.

- Link every private record to its owner.
- Enforce access where the data lives: the server, or database rules such as row-level security. Hiding a button or a page is not protection, because anyone can call the API or database directly.
- If the browser talks to a database directly with a public key, the database rules are the only protection. Make sure they exist **and work** (see `verify-it-works.md`).
- Keep admin powers narrow, behind real authentication, and never protected by a default or shared password.
- Handle the relevant lifecycle: sign-up, sign-in, sign-out, password recovery, account deletion.

## Real people's information

When the product collects information about real people (names, phones, emails, addresses, photos, messages, location, health, finances, anything about children):

- collect only what the product needs now
- decide who can see each piece, and make sure the product enforces that
- know which outside services receive it (AI APIs, analytics, email/SMS, storage), and tell the user when that matters
- give a real way to delete it, and don't promise deletion or privacy the build doesn't deliver
- for sensitive or regulated data, say that professional or legal review may be needed; a checklist does not make it compliant

Tell the user in plain language what personal data the product holds and where. They are responsible for it once real people use it.

## Uploads

- Store files in file storage, not in database fields or the app folder.
- Limit file type and size; check on the server, not only in the browser.
- Decide whether files are public links or private, and verify it.
- Deleting a record should delete or orphan-clean its files.

## Verify, then record

Verify the behavior (save, refresh/reopen, a second device or account when relevant) as described in `verify-it-works.md`. Record where data and files live, and which service provides sign-in, in `PROJECT.md`.
