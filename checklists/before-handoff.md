# Checklist: before handoff

Use every time a feature is about to be presented to the user as working. Quick for P0, thorough for P2/P3. Skip items that don't apply. Never skip the run.

The question behind every item: **what is the user unable to see that could hurt them or the people using it?**

## Works

- [ ] I ran it the way the user will use it, and the main journey works end to end.
- [ ] Data that should persist survives refresh and reopen (and a device change, if promised).
- [ ] Empty, invalid-input and failure states don't freeze or lose what the user typed.
- [ ] It works at the size of the device the user will use (usually a phone).

## Who can see and change what

- [ ] Every private record has an owner, and access is enforced on the server or by database rules, not by hiding UI.
- [ ] Nothing uses a typed-in phone number, email, name or ID as proof of identity.
- [ ] I tried as a second user, as a signed-out visitor, and by changing IDs. Nothing leaked. (P2+)
- [ ] Admin functions need real authentication, with no default or shared password left in place.

## Other people's information

- [ ] I know what personal data this feature collects, and it is the minimum needed.
- [ ] I know which outside services receive it.
- [ ] The user has been told, in one or two sentences, what personal data the product now holds.

## Money and secrets

- [ ] No secret is in front-end code, Git or logs. The pre-commit guard is installed.
- [ ] Anything that costs per use is limited (rate limit, sign-in, quota), or the user has knowingly accepted the risk.

## Recovery

- [ ] There is a Git checkpoint of this working state.
- [ ] If the data matters, there is a way back: export, backup, or the provider's recovery.

## Tell the user

- [ ] What I checked, what I couldn't check, and 2–3 concrete things they should try themselves.
- [ ] `PROJECT.md` is updated with any new decision, service, account or data location.
