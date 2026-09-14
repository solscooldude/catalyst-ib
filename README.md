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

1. Landing at `/` — public marketing page. Log in / Sign up in the header.
2. `/signup` or `/login` — demo accounts live in this browser only (password is hashed locally). After auth you land on `/dashboard`.
3. `/dashboard` — signed-in home: tokens, study calendar, month snapshot, start focus.
4. `/setup` — pick a nemesis app, connect mock ManageBac (Bio IA, TOK essay, Math AA PS, Chem study, EE chapter).
5. `/focus` — choose a task and optional goal. Demo speed is on by default: **30 seconds = 1 token** (real pace is 5 minutes).
6. `/lock` — simulated lock screen. Emergency stays; social apps are grey.
7. `/session` — timer. Mark the ManageBac task done, then complete the session.
8. `/unlocks` — spend tokens (Notes 2 / YouTube 4 / nemesis 8 per 10 minutes). Repeat buys stack time on one timer.
9. `/stats` — study calendar, subject stack (week / month), monthly roundup, and manual study logs. Official task completion adds +5 tokens; manual logs earn time tokens only.
10. `/appearance` — spend tokens on accent color, background, spark tint, and a few accessories. Mint / void / bare spark stay free for new accounts.

Product data is stored per demo account in `localStorage` (`catalyst-v1:user:<id>`). Reset demo clears only the current account. Log out returns to the marketing page.
