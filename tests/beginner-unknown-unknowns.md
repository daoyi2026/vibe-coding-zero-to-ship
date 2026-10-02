# Beginner Unknown-Unknowns Smoke Set

Version: v0.1

This 12-case smoke set quickly checks the part of the skill that matters most for a complete beginner:

> Can the agent notice software decisions the user does not know exist, turn them into questions the user can answer, and stop asking once the build is clear?

This is not a test of whether the agent can write code. It is a test of discovery quality before and during the first build decisions.

## Scoring

Score each scenario from 1 to 5 on six dimensions:

1. **Hidden-decision coverage** — notices the important unknowns that materially change the product.
2. **Question quality** — asks about user experience/outcomes, not technical jargon.
3. **Progressive disclosure** — asks only 1–3 useful questions at a time.
4. **Technical translation** — converts answers into a sensible, simple architecture without making the user choose technologies.
5. **Restraint** — does not invent unnecessary accounts, cloud services, deployment, or enterprise process.
6. **Momentum** — stops interviewing when enough is known and moves toward building.

Maximum: 30 points per scenario.

## Critical failures

Any of these is a blocker:

- starts building a vague L0/L1 product while silently assuming an architecture-changing requirement that should have been discovered;
- asks the beginner to choose implementation technologies they do not understand;
- presents a long technical questionnaire instead of progressive discovery;
- fails to surface an obvious privacy/safety consequence for sensitive real-user data;
- continues questioning after the necessary architecture-changing facts are already known;
- turns a harmless local prototype into a production architecture without user need.

## U01 — Budgeting app

Prompt:

> I want to make a budgeting app.

Strong behavior should discover progressively:

- primary device(s);
- personal vs multi-user;
- what an expense needs to remember;
- whether records must survive device changes / sync;
- sensitivity of financial data when relevant.

It should not begin with database/framework choices.

## U02 — Chinese budgeting app

Prompt:

> 我想做一个记账 app。

Same intent as U01. Check that the discovery behavior survives language change.

## U03 — Diary website

Prompt:

> Make me a diary website.

Strong behavior should clarify:

- personal vs shared;
- whether entries must persist;
- whether access should be private;
- whether photos/files are part of the experience;
- device expectations when relevant.

## U04 — Customer booking mini app

Prompt:

> 帮我做一个给客户预约的小程序。

Strong behavior should surface:

- who creates/manages availability;
- what customer information is collected;
- whether bookings require accounts or can use lighter identity;
- privacy implications of phone/name/contact data;
- what happens on double booking / cancellation;
- mobile-first expectation.

Do not make the user choose an auth provider or database.

## U05 — AI tarot

Prompt:

> I want to make an AI tarot app.

Strong behavior should discover:

- personal prototype vs public product;
- whether generated readings are saved;
- whether accounts are needed;
- paid model/API cost exposure if public;
- what experience is expected on phone/browser.

It should not overbuild a local experiment.

## U06 — Photo upload site

Prompt:

> 我要做一个可以上传照片的网站。

Strong behavior should clarify:

- who uploads;
- who can see photos;
- whether accounts are needed;
- whether files persist and where users expect them to be available;
- privacy/public exposure.

## U07 — Tiny personal checklist

Prompt:

> I just want a tiny checklist for myself on this laptop.

Strong behavior should infer that accounts/cloud sync/public deployment are probably unnecessary unless later requested.

A useful follow-up may be whether items should survive closing/reopening.

## U08 — Cross-device note app

Prompt:

> 我想做一个笔记工具，手机和电脑都能看到同样的内容。

Strong behavior should recognize cross-device persistence as already answered and avoid asking it again.

It should next discover only remaining architecture-changing facts such as single-user vs multi-user/account needs.

## U09 — App-like mobile experience

Prompt:

> I want it to feel like an app on my phone, but I don't know if I need a real app.

Strong behavior should explain the experience options in plain language and may suggest a responsive web/PWA path when sufficient.

It should not force the user to choose React Native, Swift, Flutter, or PWA terminology before explaining consequences.

## U10 — Sensitive health notes

Prompt:

> I want a private place to keep my health notes.

Strong behavior should surface privacy and access expectations early, without turning the first response into a compliance lecture.

It should distinguish personal/local simplicity from shared/cloud needs based on the user's desired experience.

## U11 — Offline field tool

Prompt:

> 我想做一个在外面没网也能填写记录，回家以后再同步的工具。

Strong behavior should recognize offline use and later sync as architecture-changing requirements already supplied by the user.

It should not ask whether offline support is needed again.

## U12 — "I don't know"

Prompt:

> I want a simple expense tracker, but I don't know what I need. Just choose for me.

Strong behavior should not interrogate the user or make silent high-impact assumptions.

It should propose a simple default, state the few consequences that matter, and ask only for any remaining user-owned choice such as primary device or whether data should survive changing devices.

## Suggested pass criteria

For an early release:

- average score >= 4.0 / 5 per dimension;
- no critical failures;
- no scenario asks more than 3 questions in the first discovery turn unless the user explicitly asks for a full requirements checklist;
- at least 10/12 scenarios translate the user's language into a sensible architecture without asking them to choose implementation technologies;
- U07 remains lightweight;
- U08 and U11 do not re-ask requirements already stated;
- Chinese and English paired cases show equivalent discovery behavior.

## Reporting

Record:

- exact skill commit;
- model/version and reasoning configuration;
- benchmark version;
- first-turn questions;
- hidden decisions discovered;
- unnecessary questions;
- technical jargon introduced before explanation;
- whether the agent knew when to stop interviewing;
- final architecture summary;
- critical failures.

Do not claim the skill improves beginner discovery until this benchmark has been run against both a baseline and the skill-enabled condition.
