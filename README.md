# Catalyst

A personal focus tool for IB DP students who doomscroll instead of writing the IA, TOK essay, or EE. Lock the apps that steal the block, finish a ManageBac task, earn tokens from that session, then buy phone time. First month free, then $2 a month.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

Spark play on Focus and My Sprite: boop the face, scrunch the twin peaks, long-press to sleep, catch a floating mint star, high-five after a session, and pick a cookie / berry / mint puff to feed. Mini-games (memory flip, streak balloon) are ideas only — not in this build.

## Palette

Default chrome is pale gray (`#F4F4F5`) with white cards and mint `#5EEAD4`. Dark mode is `#0B0B0F` / `#18181B`. Muted zinc `#A1A1AA`. Aurora is an optional quiet purple room skin, not the default. Headlines use Plus Jakarta Sans; body copy stays the existing sans. Spark keeps a cohesive twin-peak silhouette.

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
3. `/dashboard` — signed-in home: greeting, Current Sprite / Streak / Study time cards, and an App unlocks card with countdown. The sprite display name is Spark (never Flux); rename it on My Sprite or Profile. Top nav is Home · Focus · Sprite · Shop. Token sparkle pill and the account avatar open Unlocks and Profile / Account / Appearance. After signup (or any account without a diploma profile) you hit `/profile` first. Calendar and subject stack live on `/stats`.
4. `/setup` — pick one or more nemesis apps (edit the set here later; you do not re-pick at each focus start), connect mock ManageBac (Bio IA, TOK essay, Math AA PS, Chem study, EE chapter).
5. `/focus` — choose a task and optional goal. Demo speed is on by default: **30 seconds = 1 token** (real pace is 5 minutes).
6. `/lock` — simulated lock screen. Emergency stays; social apps are grey.
7. `/session` — timer. Mark the ManageBac task done, then complete the session.
8. `/unlocks` — spend tokens (Notes 2 / YouTube 4 / nemesis apps 8 per 10 minutes). Repeat buys stack time on one timer.
9. `/stats` — study calendar, subject stack (week / month), monthly roundup, and recent sessions. Official task completion adds +5 tokens; study blocks earn time tokens only.
10. `/appearance` — closet collections (rooms parked). `/sprite` is My Sprite: visual previews, tap-to-pet, springy drag, drag-a-snack-to-feed, poke, high-five, sleep. Daily login streak pays 1 token; 7 days unlocks Seven-day flare. `/quiz` is a 10-question Catalyst-original IB-style check aligned to your diploma subjects and HL/SL (tokens for correct answers, once a day — not past papers). Focus is a large spark on a quiet stage (pet, wander, morph, loop, rare +1 token).
11. `/profile` — graduating class and six DP subjects with HL or SL on each (Groups 1–5 required; Group 6 optional with an extra from another group). TOK and EE are always on the diploma. Required on first visit.
12. `/motivation` — dream colleges, course, and why it matters. A short reminder appears on the lock screen.
13. Study blocks (from Focus or Stats) lock the phone for the chosen duration. Time tokens only — no +5. Retroactive “log past study” is gone.
14. `/schedule` — recurring lock hours. The simulated phone greys during a window. The schedule itself awards no tokens.

Currency uses the mint 4-point sparkle. The circled C stays a brand mark only.

Product data is stored per demo account in `localStorage` (`catalyst-v1:user:<id>`). Reset demo clears only the current account. Log out returns to the marketing page.
