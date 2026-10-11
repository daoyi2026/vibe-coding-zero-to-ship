# Should we build this?

Use at the start of a new idea, before discovery or design. Keep the output to a few sentences unless a real blocker turns up.

A beginner usually arrives with a solution ("make me a booking app") rather than a problem ("my customers keep calling at bad times"). The agent will happily build whatever is asked. This check makes sure building is a choice the user made with the alternatives in view.

## 1. Find the real need

Infer it when obvious; otherwise ask one question:

> What do you do today without it, and what bothers you about that?

The answer often changes the product more than any technical question would.

## 2. Does something already do this?

Think about whether an existing product covers the need well enough. Common cases:

- bookings and appointments → booking platforms and booking features inside messaging or map/review apps
- forms, sign-ups, surveys → form builders, shared spreadsheets
- simple tracking (expenses, habits, inventory) → existing apps, a spreadsheet template
- a simple personal or business page → website builders, link-in-bio pages
- a shop → hosted e-commerce platforms, shop features inside social platforms
- team notes or wikis → shared document tools

If something fits, say so plainly, naming the kind of tool rather than pushing one brand, with the honest trade-off:

> You could use an existing booking tool today: free or cheap, no upkeep, but you can't change how it works. Building your own gets you exactly the flow you want, but you'll own hosting, fixes and customer data. Which matters more to you?

Building is still a legitimate choice: learning, full control, a flow nothing else offers, owning the data, or the tool itself being the business. Respect it and continue. Do not lecture or repeat the point.

Skip this step entirely when the user already said why they are building (for example "I want to learn", "nothing does X"), or for a tiny personal experiment.

## 3. Can it actually go live for this user?

Some ideas cannot reach users without registration, licences or platform approval. Find blockers that would stop launch **before** building. Rules change and vary by country, so name what to check and tell the user to confirm the current rules. Don't present details as legal advice.

Frequent blockers:

- **Mainland China:**
  - a website on a mainland server with its own domain needs ICP filing (备案) before it can be served
  - WeChat mini programs need a registered account, and many service categories (bookings, commerce) need a business or individual-business subject rather than a personal one
  - accepting payments needs a merchant account, which normally requires a business licence
  - SMS verification codes need an approved signature and template
  - mobile apps in app stores need filing too
- **Payments anywhere:** a payment provider account with identity or business verification. Taking money also brings refunds, tax and disputes.
- **App stores:** developer accounts (often paid yearly), review, and privacy disclosures.
- **Regulated content:** health or medical advice, finance or lending, education for minors, news, and public user-generated content can need licences or extra obligations.
- **Personal data:** collecting other people's names, phones, photos or health details brings privacy-law duties such as consent, purpose, deletion and security.

If a blocker applies, say what it is, what it means in practice (time, cost, needing a registered business), and the options, for example: an overseas host instead of filing, a web page instead of a mini program, or a payment link instead of in-app payments.

## 4. What form fits the need?

Ask about the experience, then pick the form yourself:

> Will people open it from a link, find it inside WeChat, or expect to install it from an app store? Is it mostly on phones?

Rough order from least to most work:

1. a spreadsheet, form or shared document
2. a single web page
3. a web app that can be added to the phone home screen (PWA)
4. a mini program inside a platform
5. a native app in an app store

Pick the lowest that delivers the experience. Explain the choice in one sentence.

## Output

A short paragraph or a few bullets, then move on to `discovery.md`. If the user picks an existing tool, help them set it up well. That is a successful outcome too.
