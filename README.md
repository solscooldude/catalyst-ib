# Catalyst

A personal focus tool for IB DP students. Lock the apps that steal the block, sit a focus session, earn tokens from that time, then buy phone time. This web demo is free — no subscribe or checkout.

This repo is a **web demo plus a Chrome MV3 lock extension**. The web app is the control plane: lock hours, tiers, token unlocks, nemesis +1, allowlist edits. The extension is what can see the active tab URL and block distractors. School and work sites are never blocked — only the known distractor list. Tasks are **manual** (title, optional subject and due). Marking a task done is a checklist only — it does not pay tokens. Tokens come from a focus session. Switching to Docs or another allowlisted school site does not pause earn. School integrations (ManageBac / Google Classroom) are hidden for now; helper APIs remain in the repo unused.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Sprite play on Focus and My Sprite: poke a side, boop the face, scrunch the twin peaks, double-tap to spin, drag across the belly to tickle, wave the cursor nearby for a mirrored pose, long-press to sleep, feed a snack, catch a mint star. Equip by tapping an owned look on My Sprite — the full catalog stays in Appearance. My Sprite ⓘ lists the short cheat sheet. Focus can sit the sprite beside the timer (study buddy sit). No random high-fives. Heart sunglasses are oversized on the face. Auras are a body-glow colour (mint, pink, gold, lavender, aurora) — one at a time.

Sprite starts as an egg and hatches on the first real focus block or snack, then grows Hatchling → Sparklet → Steady → Bright → Luminary from study time, streak, and care. My Sprite has a quiet care-stage ⓘ and an Avoid falling objects minigame (arrow keys or A/D; survive 12s for a small token bonus). Play-with ⓘ is a centered sheet. Planner lives under Home: to-dos, a week grid, tests and deadlines. First-run intro is Welcome → problem / tool / focus / sprite / tokens → Finish setting up account (Skip once, never again), then required profile + lock hours (default after school 16:30–19:30) before Home. Soft sounds can mute in Account settings. Friends is a top-level tab: task races, manage add/remove, and a leaderboard ranked by study minutes then tasks completed. Minigames stay on My Sprite.

## Palette

Default chrome is dark (`#0B0B0F` / `#18181B`) with mint `#5EEAD4`. Light mode is pale gray (`#F4F4F5`) with white cards; night-sky stars and pale trails invert so they stay visible. Muted zinc `#A1A1AA`. Aurora is an optional quiet purple room skin, not the default. Headlines use Plus Jakarta Sans; body copy stays Geist. The sprite keeps a cohesive twin-peak silhouette. Default name is Sprite.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

## Chrome extension (Load unpacked)

Chrome will not install an unpacked extension from a website. Setup and Account settings have an **Add extension** button that downloads [`/catalyst-lock-extension.zip`](https://catalyst-ib.vercel.app/catalyst-lock-extension.zip) and opens a short Load unpacked guide. The zip is also built into `public/` so you do not need this repo.

The extension lives in `extension/`. Keep the Catalyst tab open so it can write lock hours, unlocks, and the allowlist into `chrome.storage`. After install, the page shows **Extension connected** when the extension pings this tab.

1. Download `catalyst-lock-extension.zip` (or `unzip-then-select-the-extension-folder.zip` — same files)
2. **Unzip / Extract** it. You must get a folder named `extension` with `manifest.json` inside
3. Open Chrome → `chrome://extensions`
4. Turn on **Developer mode**
5. Click **Load unpacked** and select the **`extension` folder**. Never the `.zip`. Never Downloads itself. If the picker only shows a zip, cancel and unzip first
6. Return to Catalyst so policy syncs
7. Click the **Catalyst Lock** toolbar icon for ON / OFF, hours, sync, and unlocks. After you replace files, open `chrome://extensions` and press **Reload** on Catalyst Lock
8. During lock hours, open YouTube or Instagram — you should see the Locked page. Docs stays open. The toolbar popup also shows ON without opening `chrome://extensions`.

To pack a zip:

```bash
npm run pack:extension
```

Policy tests:

```bash
npm run test:policy
```

```bash
npm run build
```

## Demo path

1. Landing at `/` — public marketing page. Log in / Sign up in the header.
2. `/signup` or `/login` — demo accounts live in this browser only. Signup is email + password only; lock hours come after the intro.
3. `/intro` — first-run only. Welcome → problem, tool, focus, sprite, tokens → Finish setting up account. Then `/profile` — IB profile plus required lock hours (default after school 16:30–19:30; weeknights 7–10pm is an optional preset). Username placeholder is `username` (empty until you type). Home opens only after both are saved. `/dashboard` — mint Home: greeting, Share this week (9:16 Stories card), three soft cards (Current Sprite with a My Sprite button / Streak / Today's study goal with hours + a tick to confirm, a popup that names the hours and the 8-token finish reward, then Start focus), a dedicated App unlocks card (Unlock Tier 2 / Unlock Tier 3 / Open nemesis +1 — no per-app list), then quiet hours. School tools are always allowed and are not sold. Token pill jumps to that card and shows remaining time when something is on. Same card rhythm on Focus, Stats, Planner, Shop, Sprite, and account pages. Default chrome stays mint; Aurora is an optional room skin. Daily streak starts on day 1 (+1 circle), is unlimited, pays day N = N tokens, and awards cool / magical / elite clothing every 7 days.
4. Avatar menu — username next to the profile picture, then IB profile and Account settings. Friends is a top-level nav tab, not under Sprite. Light/dark chrome. Not Unlocks, Appearance, Focus, Sprite, or subscribe. Aurora lives in Shop → Room.
5. `/setup` — nemesis apps + required lock hours + **Add extension** (zip download + Load unpacked guide). No school-provider step. `/integrations` redirects to Focus.
6. `/focus` — add a task by hand, or start a subject-only study block. Tasks group by the subjects you take. Task description is a collapsible extra panel. Start focus goes straight into the session UI (no iPhone lock preview). Last Focus stage (night sky / deep blue sea / math drift) is remembered on this device. Demo: **10 tokens per 20 seconds**, credited live as the timer runs. Production target: **1 token per 2 minutes**. Marking a task done does not pay tokens.
7. `/session` — timer counts up in the center of the HUD (no sprite name) until you End — it does not reset. Switching to Docs or another allowlisted school site does not pause earn. Pause is a button. Unlock Tier 2 / 3 / nemesis still works, with a 10 / 20 / 30 minute duration. Study buddy sit places the sprite next to the timer. Tokens tick into the wallet on the same cadence as the live counter. Unlock UI on Focus is collapsed until you open it. End returns to the Focus board.
8. `/unlocks` — the one dedicated Unlocks route (linked from Home and Focus only). Lists school/allowed apps (stay free), Tier 2 (medium), Tier 3 social (Instagram, TikTok, Snapchat, Reddit, X, Discord — 15 tokens / 10 min), and your nemesis set. Opening a nemesis costs +1 on top of Tier 3 (16). BeReal is gone. YouTube and WhatsApp are nemesis picks, not Tier 2. Home shows Unlock Tier 2 / Unlock Tier 3 / Open nemesis. Focus has a compact, hideable panel. The token pill jumps to Home.
9. `/sprite` — My Sprite. Equip UI lists owned looks only. `/appearance` is the Token shop: Sprite shop (cosmetics, sprite colour, sprite gradient, auras / body glow, trails) vs App appearance (focus scenes, rooms). Each sprite section rotates up to 4 purchasable items per local day; owned and free looks stay listed. Gold has a metallic shine so it is not lemon. Cosmic is dark + light blue with stars. `/quiz` is a daily check against homework-style captions.
10. `/stats` — time by subject, monthly roundup, and a shareable weekly Instagram Stories card (9:16 PNG: top subject, streak, study time, tokens, sprite peek, mint Catalyst mark). Home has the same Share this week action.
11. `/planner` — week view, to-dos, tests and deadlines. Under Home.
12. `/profile` — username, picture, diploma subjects, graduating year, and optional college / course. No “why it matters” section.
13. `/account/settings` — Chrome lock extension (same Add extension flow as Setup), school allowlist (defaults + extras), blocked hosts per tier, account basics, mute. `/account/subscription` redirects there. Billing is stubbed; this demo is free. `/locked` is the in-app interstitial the extension can point at.
14. `/friends` — top-level tab. Task races (same manual task), manage friends (choosable unique code, add/remove), and a leaderboard ranked by study minutes, then tasks completed. Avoid falling objects lives on My Sprite, not here.

Shop uses two obvious cards — Sprite shop and App appearance — each with its own dropdown (Sprite shop: Cosmetics, Colours, Gradients, Auras, Trails · App appearance: Focus scenes, Rooms). Sprite shop sections each list up to 4 for-sale items that day (owned stays owned). Equip on My Sprite is tap-to-wear only. Focus scenes sells session backdrops only (night sky, deep blue sea, math drift). Photo rooms are gone. Trails is a shop chip, not a nav dropdown. Aurora and star dots are app chrome, not Focus scenes. Light/dark chrome defaults to dark and persists; light stays available. On light chrome, night-sky stars and pale trails invert to dark so they stay visible. Accent colours and room chrome are sold as a hue (rainbow set, plus the old lilac / blush / baby-blue washes); Pastel / Normal / Deep is a dropdown after purchase, not a second SKU. Void and star dots stay special. Sprite body colours include extra solids (10–14) and premium two-tone gradients (40–44, Aurora 90). Clothes include a red neck scarf (wrap + hanging ends), headphones, a draped mini cape, bow tie, larger heart sunglasses, a beanie, and a unicorn horn. Auras are glow colours around the body (mint, lavender, pink, gold, aurora) — one at a time, not a ring prop. Equipped colours, clothes, and auras persist. My Sprite equip lists owned looks only. Token mark stays the mint sparkle.

Focus stages sit behind the sprite and never cover the HUD. Night sky is the free default. Light/dark theme only restyles chrome; the session canvas keeps the selected scene in both themes. Pick a backdrop on Focus setup or in the Shop. Last scene is remembered on this device.
