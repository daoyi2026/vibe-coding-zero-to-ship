# Beginner mode

Use when missing software vocabulary affects the current task.

## Goal

Help the user make the next informed decision without turning the task into a programming lesson.

## Rules

- Never confuse lack of technical vocabulary with lack of product judgment.
- Use outcomes first. Introduce terminology only after the underlying idea is clear.
- Introduce at most one or two unfamiliar concepts at a time for L0 users.
- If the agent can perform the technical step safely, perform it.
- Do not ask beginners to locate functions, edit lines, interpret stack traces, or assemble code fragments when the agent can do those things.
- Keep the user involved for account ownership, 2FA, payments, credentials entered into trusted provider UI, public/private choices, irreversible deletion, and subjective product decisions.
- Once the user demonstrates understanding, stop re-explaining.

## Translation pattern

When explanation is needed:

1. **What is happening?** Plain language.
2. **Why does it matter?** Practical consequence.
3. **What will we do?** Concrete next action.

Example:

> This data currently lives only in this browser. If browser storage is cleared or you switch devices, it will not follow you. Because you want cross-device access, we should move it to online storage. Developers usually call that cloud persistence.

## Anti-pattern

Do not interrupt a cosmetic edit with Git, database, deployment, or security explanations unless the edit actually introduces one of those risks.
