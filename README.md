# Catalyst

A personal focus tool for IB DP students. Lock the apps that steal the block, finish a ManageBac task, earn tokens from that session, then buy phone time. First month free, then $2 a month.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Spark play on Focus and My Sprite: boop the face, scrunch the twin peaks, long-press to sleep, catch a floating mint star, high-five the labeled hand, and pick a cookie / berry / mint puff to feed. Mini-games are ideas only — not in this build. Planner is deferred.

## Palette

Default chrome is pale gray (`#F4F4F5`) with white cards and mint `#5EEAD4`. Dark mode is `#0B0B0F` / `#18181B`. Muted zinc `#A1A1AA`. Aurora is an optional quiet purple room skin, not the default. Headlines use Plus Jakarta Sans; body copy stays Geist. Spark keeps a cohesive twin-peak silhouette.

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
2. `/signup` or `/login` — demo accounts live in this browser only.
3. `/dashboard` — greeting, Current Sprite / Streak / Study time, quiet hours, and inline app unlocks (spend without leaving Home).
4. Avatar menu — Subscription ($2/mo), IB profile, Settings (email + password). Not Unlocks, Appearance, Focus, or Sprite.
5. `/setup` — nemesis apps + mock ManageBac.
6. `/focus` — pick a ManageBac task or start a study block. Demo speed: **30 seconds = 1 token**.
7. `/session` — timer counts up. Pause or End anytime. Compact unlocks panel stays on the board.
8. `/unlocks` — the dedicated spend route (also linked from the token pill). Recap lands here after End.
9. `/sprite` — My Sprite. `/appearance` is the closet. `/quiz` is a daily IB-style check.
10. `/profile` — diploma subjects, graduating year, and optional college / course / why (folded in; there is no Motivation page).
11. `/account/subscription` and `/account/settings` — plan and account basics.

Focus stages: Night sky (free), Deep blue sea, Math drift, Quiet spotlight. Last stage is remembered on this device.
