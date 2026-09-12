# Catalyst

A personal focus tool for IB DP students who doomscroll instead of writing the IA, TOK essay, or EE. Lock the nemesis app, finish a ManageBac task, earn tokens, then buy phone time.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

## Palette

Near-black base `#0B0B0F`, surfaces `#121218`, muted `#A1A1AA`, text `#F4F4F5`, mint cyan accent `#5EEAD4`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

```bash
npm run build
```

## Demo path

1. Landing at `/` — problem, loop, token table, pricing tease.
2. `/app/setup` — pick a nemesis app, connect mock ManageBac (Bio IA, TOK essay, Math AA PS, Chem study, EE chapter).
3. `/app` — choose a task and optional goal. Demo speed is on by default: **30 seconds = 1 token** (real pace is 5 minutes).
4. `/app/lock` — simulated lock screen. Emergency stays; social apps are grey.
5. `/app/focus` — timer. Mark the ManageBac task done, then complete the session.
6. `/app/unlock` — spend tokens (Notes 2 / YouTube 4 / nemesis 8 per 10 minutes). Demo unlocks last 60 seconds.

Tokens, setup, task completion, and unlocks persist in `localStorage` under `catalyst-v1`. Use **Reset demo** in the app header to start over.
