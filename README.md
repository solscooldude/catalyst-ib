# Catalyst

A personal focus tool. Lock the apps that steal the block, sit a focus session, earn tokens from that time, then buy phone time. Accounts use Clerk (Google + email). This app is free — no subscribe or checkout.

This repo is a **web app plus a Chrome MV3 lock extension**. The web app is the control plane: lock hours, tiers, token unlocks, nemesis +1, allowlist edits. Signed-in users save core state to Clerk so browser A and browser B match. The extension is what can see the active tab URL and block distractors. School and work sites are never blocked — only the known distractor list. Tasks are **manual**. Subject is required from the subjects already saved in Setup/Profile (no free-text blank subject). Task description is required — there is a clipboard paste button for text you already copied. Helper copy mentions Classroom or ManageBac as a place you might copy from. No Classroom/ManageBac sync, API, OAuth, or import. Due date is optional. Marking a task done is a checklist only — it does not pay tokens. Tokens come from a focus session. Switching to Docs or another allowlisted school site does not pause earn.

The currency mark is the mint four-point sparkle everywhere (nav pill, price rows, Buy / Unlock buttons). One sparkle on spend buttons — never a circled C or hex C as the token icon.

Sprite play on Focus and My Sprite: poke a side, boop the face, scrunch the twin peaks, double-tap to spin, drag across the belly to tickle, wave the cursor nearby for a mirrored pose, long-press to sleep, feed a snack, catch a mint star. Equip by tapping an owned look on My Sprite — the full catalog stays in Appearance. My Sprite ⓘ lists the short cheat sheet. Focus can sit the sprite beside the timer (study buddy sit). No random high-fives. Heart sunglasses are oversized on the face. Auras are a body-glow colour (mint, pink, gold, lavender, aurora) — one at a time.

Sprite starts as an egg and hatches on the first real focus block or snack, then grows Hatchling → Sparklet → Steady → Bright → Luminary from study time, streak, and care. My Sprite has a quiet care-stage ⓘ and an Avoid falling objects minigame (arrow keys or A/D; survive 12s for a small token bonus). Play-with ⓘ is a centered sheet. Planner lives under Home: to-dos, a week grid, tests and deadlines. First-run intro is Welcome → problem / tool / focus / sprite / tokens → Finish setting up account (Skip once, never again), then required profile + lock hours (default after school 16:30–19:30) before Home. Soft sounds can mute in Account settings. Friends is a top-level tab: task races, add/remove with a system-assigned friend code, and a leaderboard ranked by study time this week (Monday–Sunday, local time). Minigames stay on My Sprite.

## Palette

Default chrome is dark (`#0B0B0F` / `#18181B`) with mint `#5EEAD4`. Light mode is pale gray (`#F4F4F5`) with white cards; night-sky stars and pale trails invert so they stay visible. Muted zinc `#A1A1AA`. Aurora is an optional quiet purple room skin, not the default. Headlines use Plus Jakarta Sans; body copy stays Geist. The sprite keeps a cohesive twin-peak silhouette. Default name is Sprite.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127). Copy `.env.example` to `.env.local` and add Clerk keys if you want Google + email locally.

## Clerk (Google + email)

Catalyst uses `@clerk/nextjs`. Core user state (username, avatar URL, tokens, lock-hours schedule, nemeses, allowlist extras, unlock timers, sprite ownership/equip/care, daily study goal, friend code) is stored in **Clerk private user metadata**. No extra database is required.

If Clerk keys are missing, Setup and Account stay quiet and let you continue on this device instead of pretending localStorage is an account.

### Vercel environment variables

Set these on the Catalyst project for **Production, Preview, and Development**, then redeploy:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (`pk_test_…` or `pk_live_…`) |
| `CLERK_SECRET_KEY` | Clerk secret key (`sk_test_…` or `sk_live_…`) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/intro` |

Optional Clerk extras if your instance needs them: `NEXT_PUBLIC_CLERK_DOMAIN`, `CLERK_WEBHOOK_SECRET` (not required for this pass).

### Clerk dashboard toggles

1. [Create a Clerk application](https://dashboard.clerk.com) (or use the Vercel Marketplace Clerk integration, which can provision the two keys).
2. **Configure → Paths**: Sign-in `/sign-in`, Sign-up `/sign-up`. Add `https://catalyst-study.vercel.app` and `http://localhost:43127` as allowed origins / redirect URLs.
3. **User & Authentication → Email, phone, username**
   - Email address: **On**, required
   - **Email verification code**: **On** (cleanest email path)
   - Email magic link: Off unless you prefer links
   - Password: **Off**
4. **User & Authentication → SSO connections → Google**: **On**. Paste a Google Cloud OAuth Client ID and secret. Authorized redirect URI comes from the Clerk Google connection screen (copy it exactly). Authorized JavaScript origins: `https://catalyst-study.vercel.app`, `http://localhost:43127`.
5. After saving keys on Vercel, **redeploy** so `NEXT_PUBLIC_*` reaches the browser.

Until those keys exist, `/sign-in` shows a quiet **Continue** fallback on this device.

## Chrome extension (Load unpacked)

Chrome will not install an unpacked extension from a website. Setup and Account settings have an **Add extension** button that downloads [`/catalyst-lock-extension.zip`](https://catalyst-study.vercel.app/catalyst-lock-extension.zip) and opens a short Load unpacked guide. The zip is also built into `public/` so you do not need this repo.

The extension lives in `extension/`. Keep the Catalyst tab open so it can write lock hours, unlocks, and the allowlist into `chrome.storage`. After install, the page shows **Extension connected** when the extension pings this tab.

1. Download `catalyst-lock-extension.zip` (or `unzip-then-select-the-extension-folder.zip` — same files)
2. **Unzip / Extract** it. You must get a folder named `extension` with `manifest.json` inside
3. Open Chrome → `chrome://extensions`
4. Turn on **Developer mode`
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

## App path

1. Landing at `/` — public marketing page. Sign in / Sign up in the header.
2. `/sign-in` or `/sign-up` (`/login` and `/signup` redirect here) — Google or email code via Clerk. First sign-in imports this browser’s previous local data once if the account is empty.
3. `/intro` — first-run only. Welcome → problem, tool, focus, sprite, tokens → Finish setting up account. Then `/profile` — profile plus required lock hours (default after school 16:30–19:30; weeknights 7–10pm is an optional preset). Username placeholder is `username` (empty until you type). Home opens only after both are saved. `/dashboard` — mint Home: greeting, Share this week (9:16 Stories card), three soft cards (Current Sprite with a My Sprite button / Streak / Today's study goal with hours + a tick to confirm, a popup that names the hours and the 8-token finish reward, then Start focus), a dedicated App unlocks card (Unlock Tier 2 / Unlock Tier 3 / Open nemesis +1 — no per-app list), then quiet hours. School tools are always allowed and are not sold. Token pill jumps to that card and shows remaining time when something is on. Same card rhythm on Focus, Stats, Planner, Shop, Sprite, and account pages. Default chrome stays mint; Aurora is an optional room skin. Daily streak starts on day 1 (+1 circle), is unlimited, pays day N = N tokens, and awards cool / magical / elite clothing every 7 days.
4. Avatar menu — username next to the profile picture, then Profile and Account settings. Friends is a top-level nav tab, not under Sprite. Light/dark chrome. Not Unlocks, Appearance, Focus, Sprite, or subscribe. Aurora lives in Shop → Room.
5. `/setup` — nemesis apps + required lock hours + **Add extension** (zip download + Load unpacked guide). No school-provider step. `/integrations` redirects to Focus.
6. `/focus` — add a task by hand, or start a subject-only study block. Subject is required from the Setup/Profile list. Task description is required (clipboard paste helper only — no Classroom/ManageBac sync). Start focus goes straight into the session UI (no iPhone lock preview). Last Focus stage (night sky / deep blue sea / math drift) is remembered on this device. Earn: **1 token per 2 minutes**. Marking a task done does not pay tokens.
7. `/session` — timer counts up in the center of the HUD (no sprite name) until you End — it does not reset. Switching to Docs or another allowlisted school site does not pause earn. Pause is a button. Unlock Tier 2 / 3 / nemesis still works, with a 10 / 20 / 30 minute duration. Study buddy sit places the sprite next to the timer. Tokens tick into the wallet on the same cadence as the live counter. Unlock UI on Focus is collapsed until you open it. End returns to the Focus board.
8. `/unlocks` — the one dedicated Unlocks route (linked from Home and Focus only). Lists school/allowed apps (stay free), Tier 2 (medium), Tier 3 social (Instagram, TikTok, Snapchat, Reddit, X, Discord — 15 tokens / 10 min), and your nemesis set. Opening a nemesis costs +1 on top of Tier 3 (16). BeReal is gone. YouTube and WhatsApp are nemesis picks, not Tier 2. Home shows Unlock Tier 2 / Unlock Tier 3 / Open nemesis. Focus has a compact, hideable panel. The token pill jumps to Home.
9. `/sprite` — My Sprite. Equip UI lists owned looks only. `/appearance` is the Token shop: Sprite shop (cosmetics, sprite colour, sprite gradient, auras / body glow, trails) vs App appearance (focus scenes, rooms). Each sprite section rotates up to 4 purchasable items per local day; owned and free looks stay listed. Streak clothes (Cool hood / Magical mantle / Elite crown at 7 / 14 / 21 days) and the seven-day trail are not in the shop — a one-time popup awards them. Gold has a metallic shine so it is not lemon. Cosmic is dark + light blue with stars. `/quiz` is a daily check against homework-style captions.
10. `/stats` — time by subject, monthly roundup, and a shareable weekly Instagram Stories card (9:16 PNG: top subject, streak, study time, tokens, sprite peek, mint Catalyst mark). Home has the same Share this week action.
11. `/planner` — week view, to-dos, tests and deadlines. Under Home.
12. `/profile` — username, picture, diploma subjects, graduating year, and optional college / course. No “why it matters” section.
13. `/account/settings` — Sign-in status, Save to account, Chrome lock extension (same Add extension flow as Setup), school allowlist (defaults + extras), blocked hosts per tier, mute. `/account/subscription` redirects there. Billing is stubbed. `/locked` is the in-app interstitial the extension can point at.
14. `/friends` — top-level tab. Task races (same manual task), friends list + add by assigned code (display and copy only — not customizable), and a leaderboard ranked by study time this week (Monday–Sunday, your local time). Avoid falling objects lives on My Sprite, not here.

Shop uses two obvious cards — Sprite shop and App appearance — each with its own dropdown (Sprite shop: Cosmetics, Colours, Gradients, Auras, Trails · App appearance: Focus scenes, Rooms). Sprite shop sections each list up to 4 for-sale items that day (owned stays owned). Streak-gated clothes and the seven-day trail never appear as shop rows and cannot be bought with tokens. Equip on My Sprite is tap-to-wear only. Focus scenes sells session backdrops only (night sky, deep blue sea, math drift). Photo rooms are gone. Trails is a shop chip, not a nav dropdown. Aurora and star dots are app chrome, not Focus scenes. Light/dark chrome defaults to dark and persists; light stays available. On light chrome, night-sky stars and pale trails invert to dark so they stay visible. Accent colours and room chrome are sold as a hue (rainbow set, plus the old lilac / blush / baby-blue washes); Pastel / Normal / Deep is a dropdown after purchase, not a second SKU. Void and star dots stay special. Sprite body colours include extra solids (10–14) and premium two-tone gradients (40–44, Aurora 90). Clothes include a red neck scarf (wrap + hanging ends), headphones, a draped mini cape, bow tie, larger heart sunglasses, a beanie, and a unicorn horn. Auras are glow colours around the body (mint, lavender, pink, gold, aurora) — one at a time, not a ring prop. Equipped colours, clothes, and auras persist. My Sprite equip lists owned looks only. Token mark stays the mint sparkle.

Focus stages sit behind the sprite and never cover the HUD. Night sky is the free default. Light/dark theme only restyles chrome; the session canvas keeps the selected scene in both themes. Pick a backdrop on Focus setup or in the Shop. Last scene is remembered on this device.
