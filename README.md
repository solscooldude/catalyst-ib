# Catalyst

A personal focus tool for IB DP students. Lock the apps that steal the block, finish a ManageBac task, earn tokens from that session, then buy phone time. This web demo is free — no subscribe or checkout.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Spark play on Focus, My Sprite, and Home: boop the face, scrunch the twin peaks (they stay one silhouette), long-press to sleep (long-press again to wake), catch a floating mint star, and pick a cookie / berry / mint puff to feed. Mood follows streak and study time. Eyes glance toward the cursor only on My Sprite, and not while asleep. Subject / rainbow particles are rare short orbit bursts (subject change, session start, then long idle gaps) — not a constant ring.

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
3. `/dashboard` — mint Home: greeting, Share this week (9:16 Stories card), three soft cards (Current Sprite / Streak / Study time), a dedicated App unlocks card (spend + live countdown), then quiet hours. Token pill jumps to that card and shows remaining time when something is on. Same card rhythm on Focus, Stats, Shop, Sprite, and account pages. Default chrome stays mint; Aurora is an optional room skin.
4. Avatar menu — IB profile, Account settings, light/dark chrome. Not Unlocks, Appearance, Focus, Sprite, or subscribe. Aurora lives in Shop → Room.
5. `/setup` — nemesis apps + mock ManageBac. Quiet hours live on `/schedule`; Home shows today’s lock window as one chip.
6. `/focus` — pick a ManageBac task or start a study block. Last Focus stage (night sky / deep blue sea / math drift) is remembered on this device. Demo: **10 tokens per 20 seconds**, credited live as the timer runs. Production target: **1 token per 2 minutes**.
7. `/session` — timer counts up in the center of the HUD (no sprite name) until you End — it does not reset. Tokens tick into the wallet on the same cadence as the live counter. Unlock UI on Focus is collapsed until you open it. End returns to the Focus board.
8. `/unlocks` — the one dedicated Unlocks route (linked from Home and Focus only). Day-to-day spend is the Home App unlocks card; Focus has a compact, hideable panel. The token pill jumps to Home.
9. `/sprite` — My Sprite. `/appearance` is the closet. Try cosmetics on Spark before you buy. `/quiz` is a daily IB-style check.
10. `/stats` — time by subject, monthly roundup, and a shareable weekly Instagram Stories card (9:16 PNG: top subject, streak, study time, tokens, Spark peek, mint Catalyst mark). Home has the same Share this week action.
11. `/profile` — diploma subjects, graduating year, and optional college / course / why (folded in; there is no Motivation page).
12. `/account/settings` — account basics. `/account/subscription` redirects there. Billing is stubbed; this demo is free.

Shop → Focus scenes sells session backdrops only (night sky, deep blue sea, math drift). Photo rooms are gone. Shop → Trails sells spark trail cosmetics only. Aurora and star dots are app chrome, not Focus scenes. Light/dark chrome defaults to light and persists. Accent colours and room chrome are sold as a hue (rainbow set, plus the old lilac / blush / baby-blue washes); Pastel / Normal / Deep is a dropdown after purchase, not a second SKU. Void and star dots stay special. Spark body colours include extra solids (10–14) and premium two-tone gradients (40–44, Aurora 90); equipped colours persist. Token mark stays the mint sparkle.

Focus stages sit behind Spark and never cover the HUD. Night sky is the free default. Light/dark theme only restyles chrome; the session canvas keeps the selected scene in both themes. Pick a backdrop on Focus setup or in the Shop. Last scene is remembered on this device.
