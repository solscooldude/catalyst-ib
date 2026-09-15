# Catalyst

A personal focus tool for IB DP students. Lock the apps that steal the block, finish a ManageBac task, earn tokens from that session, then buy phone time. This web demo is free — no subscribe or checkout.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Spark play on Focus, My Sprite, and Home: boop the face, scrunch the twin peaks (they stay one silhouette), long-press to sleep (long-press again to wake), catch a floating mint star, high-five the labeled hand, and pick a cookie / berry / mint puff to feed. Mood follows streak and study time. Eyes glance toward the cursor only on My Sprite, and not while asleep. Subject / rainbow particles are rare short orbit bursts (subject change, session start, then long idle gaps) — not a constant ring.

Mini-game ideas only — not in this build: memory/flip cards, streak balloon. Soft focus washes (spotlight / gradient / subject tint) are next after these interactions. Planner is deferred.

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
3. `/dashboard` — mint Home: greeting, three soft cards (Current Sprite / Streak / Study time), a dedicated App unlocks card (spend + live countdown), then quiet hours. Token pill jumps to that card and shows remaining time when something is on. Same card rhythm on Focus, Stats, Shop, Sprite, and account pages. Default chrome stays mint; Aurora is an optional room skin.
4. Avatar menu — IB profile, Account settings, light/dark chrome. Not Unlocks, Appearance, Focus, Sprite, or subscribe. Aurora lives in Shop → Room.
5. `/setup` — nemesis apps + mock ManageBac. Quiet hours live on `/schedule`; Home shows today’s lock window as one chip.
6. `/focus` — pick a ManageBac task or start a study block. Last Focus stage (night sky / deep blue sea / math drift) is remembered on this device. Demo: **10 tokens per 20 seconds**, paid once when you End. Production target: **1 token per 2 minutes**.
7. `/session` — timer counts up in the center of the HUD (no sprite name). Pause or End anytime. Tokens are not awarded mid-session. Compact unlocks panel stays on the board.
8. `/unlocks` — the one dedicated Unlocks route (linked from Home and Focus only). After End, a recap card shows minutes and tokens and Spark celebrates. Day-to-day spend is the Home App unlocks card; Focus has a compact panel. The token pill jumps to Home.
9. `/sprite` — My Sprite. `/appearance` is the closet. Try cosmetics on Spark before you buy. `/quiz` is a daily IB-style check.
10. `/profile` — diploma subjects, graduating year, and optional college / course / why (folded in; there is no Motivation page).
11. `/account/settings` — account basics. `/account/subscription` is a free-demo stub, not a checkout.

Shop → Focus scenes sells session backdrops only (night sky, deep blue sea, math drift, plus cat study / desk window / library attic / rocket). Shop → Trails sells spark trail cosmetics only. Aurora and star dots are app chrome, not Focus scenes.

Focus stages sit behind Spark and never cover the HUD. Night sky is the free default. Light/dark theme only restyles chrome; the session canvas keeps the selected scene in both themes. Pick a backdrop on Focus setup or in the Shop. Last scene is remembered on this device.
