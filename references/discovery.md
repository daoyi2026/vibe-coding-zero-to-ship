# Discovery

Use when a beginner starts a new product or a major feature with a vague outcome. Goal: learn just enough to choose a safe, simple design, then build.

The user answers questions about **what they want to experience**. The agent translates the answers into technical requirements and makes the technical choices.

## How to ask

- At most three questions per turn. One or two is usually better.
- Everyday language about outcomes. Good: "If you change phones, should your old records still be there?" Bad: "Do you need cloud persistence?"
- Never ask the user to choose technologies (framework, database, auth provider, hosting) unless they ask to.
- Don't ask about budget unless something will actually cost money.
- Infer what is obvious from context, and never re-ask something already answered.
- "I don't know" or "you choose" → pick the simplest sensible default, say the one or two consequences that matter, continue.
- Stop as soon as the build is clear. Remaining details can be decided later or defaulted.

## What can change the build (agent's internal map; never show it as a list)

Roughly in the order it usually matters:

1. who uses it: just the user, a few known people, or the public
2. main device and form: phone, computer, both; link, home-screen app, mini program, store app
3. the one core action and what the user gets from it
4. what it must remember, in product terms (for example amount, date, category, note, receipt photo)
5. whether that survives refresh, closing, and changing devices
6. whether people need their own private data, and who may see or change what
7. photos or files
8. whether the information is sensitive (health, money, identity, children, location, private messages)
9. offline use
10. anything that costs per use (AI, SMS, maps, storage)
11. how important data is recovered if something goes wrong

## Example

> **User:** I want to make a budgeting app.
>
> **Agent:** Two things shape the whole thing: will you mostly use it on your phone, your computer, or both? And is it just for you, or should other people have their own accounts one day?
>
> **User:** Phone, just me.
>
> **Agent:** If you replace your phone, should your old records still be there?

Only after this answer does the agent decide between on-device storage (simple, but lost with the device unless exported) and online storage (survives devices, needs an account or similar).

## After discovery

1. Record the decisions in the project's `PROJECT.md` (from `templates/PROJECT.md`). It is the agent's product memory, not a form for the user.
2. Split the work into NOW (first usable version), NEXT and LATER.
3. Describe the first version in user-visible behavior, not technology.
4. Set the project level (P0–P3, see `SKILL.md`).
5. Treat the decisions as constraints from then on. For example: mobile-first means it is built and checked on a phone from the start; data that must survive a phone change means page memory or browser-only storage is not the real solution.

## Don't

- send a full requirements questionnaire
- assume "app" means a store app
- assume data on screen is saved
- add accounts, cloud services or infrastructure the experience doesn't need
- keep interviewing once the architecture-changing facts are known
