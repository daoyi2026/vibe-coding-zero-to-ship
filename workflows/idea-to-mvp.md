# Workflow: idea to MVP

Use when a beginner has an idea but does not know where to start or does not know which software decisions exist.

## Goal

Turn a vague outcome into the smallest buildable first version without turning discovery into a product-management or programming course.

## Principle

The user should answer questions about **what they want to experience**. The agent should translate those answers into technical requirements and make routine implementation choices.

Do not ask a beginner to choose databases, frameworks, auth protocols, hosting stacks, or storage technologies unless they explicitly want that level of control.

## Flow

1. Restate in plain language:
   - who seems to use it;
   - what they do;
   - what useful result they get.
2. Identify the single core action. Infer it when obvious.
3. Find the next **1–3 unanswered facts** that could materially change the build. Prefer this order when relevant:
   - primary device/product form: phone, computer, both, browser, installable app-like experience;
   - just the user or other people too;
   - what information the product must remember;
   - whether it must survive refresh/reopen;
   - whether it must follow the user across devices;
   - whether users need identities/accounts;
   - who may see or change which data;
   - uploads/files;
   - whether the information is sensitive;
   - offline/network expectations;
   - public access;
   - paid/usage-based services.
4. Ask those questions in everyday language. Never present the whole list as a questionnaire.
5. Translate answers internally into the simplest sufficient architecture.
6. If the user says "I don't know," recommend a simple default and explain what that choice means in practical terms.
7. Record durable answers and safe inferences in `templates/PRODUCT.md`. This is the agent's product memory, not a form for the user to fill out.
8. Create a lightweight **NOW / NEXT / LATER** split.
9. Describe the MVP in user-visible behavior, not implementation jargon.
10. Infer P0–P3.
11. If the build is clear, stop interviewing and continue to `new-project.md`.

## Example

User:

> I want to make a budgeting app.

Good first response:

> Great. Two things change the whole shape of it: will you mainly use it on your phone, computer, or both? And is it just for you, or should other people eventually have their own accounts?

If they answer "phone, just me," a useful next question might be:

> If you replace your phone, should your old records still be there?

Only after that answer should the agent decide whether simple local storage is enough or online persistence is needed.

## Do not

- ask for a complete specification up front;
- make the user choose technologies they do not understand;
- assume "app" means native mobile app;
- assume visible data is automatically saved;
- add accounts, cloud storage, or production infrastructure unless the desired experience needs them;
- keep interviewing after the architecture-changing unknowns are resolved.

Do not require personas, TAM/SAM/SOM, a business plan, or a complete roadmap unless the user's actual goal requires them.
