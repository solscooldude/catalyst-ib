# Catalyst

A personal focus tool for IB DP students. Lock the apps that steal the block, finish a ManageBac task, earn tokens from that session, then buy phone time. This web demo is free — no subscribe or checkout.

This repo is a **web demo**. Phone lock and ManageBac are simulated — there is no real Screen Time or school integration.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Sprite play on Focus and My Sprite: poke a side, boop the face, scrunch the twin peaks, double-tap to spin, drag across the belly to tickle, wave the cursor nearby for a mirrored pose, long-press to sleep, feed a snack, catch a mint star. Equip by tapping an owned look on My Sprite — the full catalog stays in Appearance. My Sprite ⓘ lists the short cheat sheet. Focus can sit the sprite beside the timer (study buddy sit). No random high-fives. Heart sunglasses are oversized on the face. Auras are a body-glow colour (mint, pink, gold, lavender, aurora) — one at a time.

Mini-game ideas only — not in this build: memory/flip cards, streak balloon. Soft focus washes (spotlight / gradient / subject tint) are next after these interactions. Planner is deferred.

## Palette

Default chrome is pale gray (`#F4F4F5`) with white cards and mint `#5EEAD4`. Dark mode is `#0B0B0F` / `#18181B`. Muted zinc `#A1A1AA`. Aurora is an optional quiet purple room skin, not the default. Headlines use Plus Jakarta Sans; body copy stays Geist. The sprite keeps a cohesive twin-peak silhouette. Default name is Sprite.

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
3. `/dashboard` — mint Home: greeting, Share this week (9:16 Stories card), three soft cards (Current Sprite with a My Sprite button / Streak / Study time with Start focus, a customisable daily goal of at least 1 hour, and progress), a dedicated App unlocks card (Unlock Tier 2 / Unlock Tier 3 only — no per-app list), then quiet hours. School tools are always allowed and are not sold. Token pill jumps to that card and shows remaining time when something is on. Same card rhythm on Focus, Stats, Shop, Sprite, and account pages. Default chrome stays mint; Aurora is an optional room skin.
4. Avatar menu — IB profile, Account settings, light/dark chrome. Not Unlocks, Appearance, Focus, Sprite, or subscribe. Aurora lives in Shop → Room.
5. `/setup` — nemesis apps + mock ManageBac. Quiet hours live on `/schedule`; Home shows today’s lock window as one chip.
6. `/focus` — pick a ManageBac task or start a study block. Start focus goes straight into the session UI (no iPhone lock preview). Last Focus stage (night sky / deep blue sea / math drift) is remembered on this device. Demo: **10 tokens per 20 seconds**, credited live as the timer runs. Production target: **1 token per 2 minutes**.
7. `/session` — timer counts up in the center of the HUD (no sprite name) until you End — it does not reset. Tokens tick into the wallet on the same cadence as the live counter. Unlock UI on Focus is collapsed until you open it. End returns to the Focus board.
8. `/unlocks` — the one dedicated Unlocks route (linked from Home and Focus only). Notes is not an unlock. Day-to-day spend is the Home App unlocks card (Unlock Tier 2 at 10 tokens / 10 min, Unlock Tier 3 at 15). Focus has a compact, hideable panel. The token pill jumps to Home.
9. `/sprite` — My Sprite. Equip UI lists owned looks only. `/appearance` is the closet: Sprite appearance (cosmetics, sprite colour, sprite gradient, auras / body glow, trails) vs App appearance (focus scenes, rooms). `/quiz` is a daily IB-style check.
10. `/stats` — time by subject, monthly roundup, and a shareable weekly Instagram Stories card (9:16 PNG: top subject, streak, study time, tokens, Spark peek, mint Catalyst mark). Home has the same Share this week action.
11. `/profile` — diploma subjects, graduating year, and optional college / course / why (folded in; there is no Motivation page).
12. `/account/settings` — account basics. `/account/subscription` redirects there. Billing is stubbed; this demo is free.

Shop uses one category at a time (chips: Cosmetics, Colours, Gradients, Auras, Trails, Focus scenes, Room). Focus scenes sells session backdrops only (night sky, deep blue sea, math drift). Photo rooms are gone. Trails is a shop chip, not a nav dropdown. Aurora and star dots are app chrome, not Focus scenes. Light/dark chrome defaults to light and persists. Accent colours and room chrome are sold as a hue (rainbow set, plus the old lilac / blush / baby-blue washes); Pastel / Normal / Deep is a dropdown after purchase, not a second SKU. Void and star dots stay special. Spark body colours include extra solids (10–14) and premium two-tone gradients (40–44, Aurora 90). Clothes include a red neck scarf (wrap + hanging ends), headphones, a draped mini cape, bow tie, larger heart sunglasses, a beanie, and a unicorn horn. Auras are glow colours around the body (mint, lavender, pink, gold, aurora) — one at a time, not a ring prop. Equipped colours, clothes, and auras persist. My Sprite equip lists owned looks only. Token mark stays the mint sparkle.

Focus stages sit behind Spark and never cover the HUD. Night sky is the free default. Light/dark theme only restyles chrome; the session canvas keeps the selected scene in both themes. Pick a backdrop on Focus setup or in the Shop. Last scene is remembered on this device.
