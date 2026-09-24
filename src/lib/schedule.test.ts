import assert from "node:assert/strict";
import test from "node:test";
import {
  findDuplicateWindow,
  normalizeSchedule,
  windowSignature,
} from "./schedule.ts";

test("normalizeSchedule de-dupes the same days and times", () => {
  const schedule = normalizeSchedule([
    {
      id: "a",
      days: [1, 2, 3, 4, 5],
      start: "16:30",
      end: "19:30",
      enabled: true,
    },
    {
      id: "b",
      days: [5, 4, 3, 2, 1],
      start: "16:30:00",
      end: "19:30",
      enabled: false,
    },
    {
      id: "c",
      days: [1, 2, 3, 4, 5],
      start: "19:00",
      end: "22:00",
      enabled: true,
    },
  ]);
  assert.equal(schedule.length, 2);
  assert.equal(schedule[0].id, "a");
  assert.equal(schedule[0].enabled, true);
  assert.equal(schedule[1].id, "c");
});

test("windowSignature treats day order and extra seconds as the same window", () => {
  assert.equal(
    windowSignature({ days: [5, 1, 2, 3, 4], start: "16:30:00", end: "19:30" }),
    windowSignature({ days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30" }),
  );
});

test("findDuplicateWindow ignores the window being edited", () => {
  const schedule = normalizeSchedule([
    { id: "keep", days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30", enabled: true },
  ]);
  assert.equal(
    findDuplicateWindow(schedule, { days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30" })?.id,
    "keep",
  );
  assert.equal(
    findDuplicateWindow(
      schedule,
      { days: [1, 2, 3, 4, 5], start: "16:30", end: "19:30" },
      "keep",
    ),
    null,
  );
});
