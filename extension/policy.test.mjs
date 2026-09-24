import assert from "node:assert/strict";
import test from "node:test";
import {
  decideUrl,
  describePopup,
  lockStatus,
  normalizePolicySchedule,
} from "./policy.js";

const weekdayAfternoon = new Date("2026-09-23T17:00:00");
const weekdayMorning = new Date("2026-09-23T10:00:00");

const schedule = [
  { days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30", enabled: true },
];

const base = {
  schedule,
  nemeses: ["youtube"],
  allowlistExtra: [],
  unlockedUntil: {},
  extensionEnabled: false,
};

test("allows Google Docs during lock hours", () => {
  const decision = decideUrl(
    "https://docs.google.com/document/d/abc",
    base,
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "allow");
  assert.equal(decision.reason, "allowlist");
});

test("blocks YouTube during lock hours when it is a nemesis", () => {
  const decision = decideUrl(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    base,
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "youtube");
});

test("blocks Instagram during lock hours", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    base,
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "instagram");
});

test("does not block YouTube outside lock hours when the user turned Lock off", () => {
  const decision = decideUrl(
    "https://www.youtube.com/",
    base,
    weekdayMorning.getTime(),
  );
  assert.equal(decision.action, "allow");
  assert.equal(decision.reason, "outside-hours");
});

test("blocks YouTube outside lock hours when the user turned Lock on", () => {
  const decision = decideUrl(
    "https://www.youtube.com/",
    { ...base, extensionEnabled: true },
    weekdayMorning.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "youtube");
});

test("lock hours force the extension on even if the user left it off", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    { ...base, extensionEnabled: false },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "instagram");
});

test("a live study block forces the extension on", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    { ...base, extensionEnabled: false, sessionActive: true },
    weekdayMorning.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "instagram");
});

test("token unlock opens a blocked site", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    {
      ...base,
      unlockedUntil: { tier3: weekdayAfternoon.getTime() + 10 * 60 * 1000 },
    },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "allow");
  assert.equal(decision.reason, "unlocked");
});

test("unknown school-like hosts stay open", () => {
  const decision = decideUrl(
    "https://library.school.edu/research",
    base,
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "allow");
  assert.equal(decision.reason, "unknown");
});

test("popup lock status is unknown until policy has updatedAt", () => {
  assert.equal(lockStatus({ schedule, extensionEnabled: false }), "unknown");
  assert.equal(
    lockStatus({ ...base, updatedAt: weekdayAfternoon.getTime() }, weekdayAfternoon),
    "on",
  );
  assert.equal(
    lockStatus({ ...base, updatedAt: weekdayMorning.getTime() }, weekdayMorning),
    "off",
  );
  assert.equal(
    lockStatus(
      { ...base, extensionEnabled: false, updatedAt: weekdayAfternoon.getTime() },
      weekdayAfternoon,
    ),
    "on",
  );
});

test("popup copy names hours, unlocks, and Catalyst origin", () => {
  const now = weekdayAfternoon.getTime();
  const view = describePopup(
    {
      ...base,
      updatedAt: now - 12_000,
      unlockedUntil: { tier3: now + 8 * 60 * 1000, nemesis: now + 90 * 1000 },
      appOrigin: "http://127.0.0.1:43127/",
    },
    now,
    now - 12_000,
  );
  assert.equal(view.status, "on");
  assert.equal(view.statusLabel, "ON");
  assert.equal(view.toggleOn, true);
  assert.equal(view.toggleLocked, true);
  assert.match(view.statusDetail, /Lock hours require/);
  assert.match(view.hours, /Weeknights/);
  assert.match(view.hours, /4:30pm/);
  assert.match(view.unlocks, /Tier 3/);
  assert.match(view.unlocks, /Nemesis/);
  assert.equal(view.openHref, "http://127.0.0.1:43127");
  assert.match(view.sync, /Catalyst tab synced/);
});

test("popup unsynced state asks the user to open Catalyst", () => {
  const view = describePopup(null, weekdayMorning.getTime());
  assert.equal(view.status, "unknown");
  assert.equal(view.toggleLocked, true);
  assert.equal(view.hours, "No schedule synced — open Catalyst");
  assert.equal(view.sync, "Not synced — open Catalyst");
  assert.equal(view.openHref, "https://catalyst-study.vercel.app");
});

test("outside lock hours the popup toggle follows the user preference", () => {
  const off = describePopup(
    { ...base, updatedAt: weekdayMorning.getTime(), extensionEnabled: false },
    weekdayMorning.getTime(),
  );
  assert.equal(off.status, "off");
  assert.equal(off.toggleOn, false);
  assert.equal(off.toggleLocked, false);
  const on = describePopup(
    { ...base, updatedAt: weekdayMorning.getTime(), extensionEnabled: true },
    weekdayMorning.getTime(),
  );
  assert.equal(on.status, "on");
  assert.equal(on.toggleOn, true);
  assert.equal(on.toggleLocked, false);
});

test("weekday names still count as lock hours", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    {
      ...base,
      schedule: [
        {
          days: ["Mon", "Tue", "Wednesday", "4", "friday"],
          start: "16:30:00",
          end: "19:30:00",
        },
      ],
    },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "instagram");
});

test("string weekdays and HH:MM:SS still count as lock hours", () => {
  const decision = decideUrl(
    "https://www.instagram.com/",
    {
      ...base,
      schedule: [
        {
          days: ["1", "2", "3", "4", "5"],
          start: "16:30:00",
          end: "19:30:00",
        },
      ],
    },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "block");
  assert.equal(decision.appId, "instagram");
});

test("YouTube stays open if it is not a chosen nemesis", () => {
  const decision = decideUrl(
    "https://www.youtube.com/",
    { ...base, nemeses: ["whatsapp"] },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "allow");
});

test("normalizePolicySchedule drops duplicate day and time windows", () => {
  const schedule = normalizePolicySchedule([
    { days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30" },
    { days: [5, 4, 3, 2, 1], start: "16:30:00", end: "19:30" },
    { days: [1, 2, 3, 4, 5], start: "19:00", end: "22:00" },
  ]);
  assert.equal(schedule.length, 2);
  assert.deepEqual(schedule[0].days, [1, 2, 3, 4, 5]);
  assert.equal(schedule[0].start, "16:30");
  assert.equal(schedule[1].start, "19:00");
});
