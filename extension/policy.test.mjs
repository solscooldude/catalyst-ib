import assert from "node:assert/strict";
import test from "node:test";
import { decideUrl } from "./policy.js";

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

test("does not block YouTube outside lock hours", () => {
  const decision = decideUrl(
    "https://www.youtube.com/",
    base,
    weekdayMorning.getTime(),
  );
  assert.equal(decision.action, "allow");
  assert.equal(decision.reason, "outside-hours");
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

test("YouTube stays open if it is not a chosen nemesis", () => {
  const decision = decideUrl(
    "https://www.youtube.com/",
    { ...base, nemeses: ["whatsapp"] },
    weekdayAfternoon.getTime(),
  );
  assert.equal(decision.action, "allow");
});
