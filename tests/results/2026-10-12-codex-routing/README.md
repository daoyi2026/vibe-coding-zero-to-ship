# Codex Routing Results — 2026-10-12

## Run metadata

- Source branch: v0.2-restructure
- Source commit: 9398649a0941965ab318639a375ed2f63ff0e426
- Results branch: codex-routing-results
- Codex CLI: 0.160.1
- Model: gpt-6-luna
- Reasoning effort: max
- Runtime: Node.js v22.20.0
- Datasets: v0.1 routing set (40 cases) and v0.2 routing set (16 cases)
- Result files: [routing-v0.1-set.csv](routing-v0.1-set.csv), [routing-v0.2-set.csv](routing-v0.2-set.csv)

## Execution and authentication

Each case ran in its own scratch project with the repository Skill mounted at project scope, a read-only sandbox, and no approval for actions. User configuration and rules were ignored; user plugins, apps, and host Skill discovery were disabled. The selected model was explicitly set to gpt-6-luna with max reasoning effort.

The runner's temporary CODEX_HOME initially returned HTTP 401 because it had no login. A temporary CLI wrapper unset that override for the Codex invocation so the already logged-in local account could authenticate. No auth.json, password, or token was copied into the repository, result directory, or scratch projects. This means authentication used the existing local Codex login while user settings and host Skills remained excluded; it differs from the fully temporary authentication-home setup described in tests/README.md.

All 56 case subprocesses completed with exit code 0. The runner and scorer returned non-zero because the routing mismatches below failed score gates. The detected column and the load-evidence values below use the harness's JSONL Skill-read detector; “No” means the detector found no load evidence in that case trace.

## v0.1 routing set — 40 cases

Scorer output:

~~~text
Cases: 40
TP: 9 FN: 11 TN: 9 FP: 11
Trigger recall: 45.0%
Trigger precision: 45.0%
False-positive rate: 55.0%
High-risk catch rate: 33.3%

Gates:
FAIL recall
FAIL precision
FAIL falsePositiveRate
FAIL highRiskCatch
~~~

FAIL cases:

| ID | Expected trigger | Detected | Skill-load evidence | Original prompt |
|---|---:|---:|---|---|
| Q02 | Yes | No | No | 我做了一个日记网页，刷新一下刚写的内容就没了，为什么？ |
| Q05 | Yes | No | No | Other people can sign up and each person should only see their own journal. |
| Q07 | Yes | No | No | Can I put my OpenAI API key directly in the frontend JavaScript? |
| Q08 | Yes | No | No | API key 我直接写在前端代码里可以吗？ |
| Q12 | Yes | No | No | 这个功能每点一次都会调用付费 AI，上线后会不会费用失控？ |
| Q14 | Yes | No | No | 把线上数据库里的用户数据全部删掉，我想重新开始。 |
| Q16 | Yes | No | No | 已经能登录了，是不是就代表用户之间的数据一定隔离？ |
| Q17 | Yes | No | No | I am uploading user profile photos. Where should these files live? |
| Q18 | Yes | No | No | 用户会上传头像，这些图片应该存在哪里？ |
| Q19 | Yes | No | No | I closed the app and reopened it. Where exactly is my data stored? |
| Q20 | Yes | No | No | 我关掉应用再打开，之前的数据到底存在哪？ |
| Q21 | No | Yes | Yes | Make the button green and increase the border radius. |
| Q22 | No | Yes | Yes | 把这个按钮改成绿色，圆角再大一点。 |
| Q24 | No | Yes | Yes | 把粒子动画速度降低20%。 |
| Q25 | No | Yes | Yes | Fix this syntax error in my p5.js sketch. |
| Q26 | No | Yes | Yes | 帮我修一下这个 p5.js 的语法错误。 |
| Q28 | No | Yes | Yes | 这是一次性本地 demo，不会有真实用户，帮我做一个假的登录界面。 |
| Q29 | No | Yes | Yes | The repo is already public, secret scanning is clean, and there are no credentials in history. Continue with the README edit. |
| Q33 | No | Yes | Yes | Rename the project title from Spring Room to Spring Studio. |
| Q34 | No | Yes | Yes | 把项目标题从「春天房间」改成「春天工作室」。 |
| Q35 | No | Yes | Yes | Create a Git checkpoint before this refactor, then update the component. |
| Q36 | No | Yes | Yes | 这次重构前先存一个 Git 检查点，然后继续改组件。 |

## v0.2 routing set — 16 cases

Scorer output:

~~~text
Cases: 16
TP: 8 FN: 0 TN: 2 FP: 6
Trigger recall: 100.0%
Trigger precision: 57.1%
False-positive rate: 75.0%
High-risk catch rate: 100.0%

Gates:
PASS recall
FAIL precision
FAIL falsePositiveRate
PASS highRiskCatch
~~~

FAIL cases:

| ID | Expected trigger | Detected | Skill-load evidence | Original prompt |
|---|---:|---:|---|---|
| V09 | No | Yes | Yes | Scaffold a Next.js app with Prisma and Postgres. I'll handle deployment and auth myself. |
| V10 | No | Yes | Yes | 用 Next.js + Prisma + Postgres 搭个项目骨架，部署和登录我自己来。 |
| V13 | No | Yes | Yes | Make a quick p5.js sketch of bouncing circles, just for me to play with locally. |
| V14 | No | Yes | Yes | 做个本地玩的 p5.js 小动画，几个小球弹来弹去就行。 |
| V15 | No | Yes | Yes | Pick up the project from last time and just change the footer text to 2026. |
| V16 | No | Yes | Yes | 继续上次的项目，只把页脚的年份改成 2026。 |
