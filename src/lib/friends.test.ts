import assert from "node:assert/strict";
import test from "node:test";
import {
  formatFriendId,
  friendDisplayName,
  friendInitials,
  friendUsername,
  formatRequestTime,
  isGeneratedFriendName,
  normalizeFriend,
  normalizeFriendCode,
  normalizeFriendRequest,
  normalizeFriendRequests,
  normalizeFriends,
  overlayFriendProfile,
} from "./friends-model.ts";

test("friend codes stay assigned-style and reject junk", () => {
  assert.equal(normalizeFriendCode("cat-ab12cd"), "CAT-AB12CD");
  assert.equal(normalizeFriendCode("no"), "");
  assert.equal(normalizeFriendCode("12345678"), "");
});

test("usernames win; assigned IDs stay secondary", () => {
  assert.equal(friendUsername({ name: "sol", code: "CAT-AAAA11" }), "sol");
  assert.equal(friendDisplayName({ name: "sol", code: "CAT-AAAA11" }), "sol");
  assert.equal(friendUsername({ name: "  ", code: "CAT-AAAA11" }), "");
  assert.equal(friendDisplayName({ name: "  ", code: "CAT-AAAA11" }), "Friend");
  assert.equal(friendDisplayName({ name: "Friend AA11", code: "CAT-AAAA11" }), "Friend");
  assert.equal(isGeneratedFriendName("Friend AA11", "CAT-AAAA11"), true);
  assert.equal(isGeneratedFriendName("sol", "CAT-AAAA11"), false);
  assert.equal(formatFriendId("cat-aaaa11"), "ID CAT-AAAA11");
  assert.equal(friendInitials("sol aia"), "SA");
  assert.equal(friendInitials(""), "?");
});

test("https and setup photos survive on friend rows; junk does not", () => {
  const row = normalizeFriend({
    code: "CAT-BBBB22",
    name: "mira",
    avatarUrl: "https://img.clerk.com/abc",
  });
  assert.equal(row?.name, "mira");
  assert.equal(row?.avatarUrl, "https://img.clerk.com/abc");
  assert.equal(
    normalizeFriend({
      code: "CAT-BBBB22",
      name: "mira",
      avatarUrl: "data:image/png;base64,xxxx",
    })?.avatarUrl,
    "data:image/png;base64,xxxx",
  );
  assert.equal(
    normalizeFriend({
      code: "CAT-BBBB22",
      avatarUrl: "javascript:alert(1)",
    })?.avatarUrl,
    null,
  );
});

test("live profile overlay replaces stub IDs with the setup username", () => {
  const before = normalizeFriend({
    code: "CAT-FFFF66",
    name: "Friend FF66",
  });
  assert.ok(before);
  const next = overlayFriendProfile(before, {
    name: "juniper",
    avatarUrl: "https://img.clerk.com/jun",
  });
  assert.equal(next.name, "juniper");
  assert.equal(next.avatarUrl, "https://img.clerk.com/jun");
  assert.equal(friendDisplayName(next), "juniper");
  assert.equal(formatFriendId(next.code), "ID CAT-FFFF66");
});

test("requests dedupe by direction and code", () => {
  const rows = normalizeFriendRequests([
    {
      code: "CAT-CCCC33",
      name: "ada",
      direction: "in",
      sentAt: 100,
      avatarUrl: "https://example.com/a.png",
    },
    {
      code: "CAT-CCCC33",
      name: "ada 2",
      direction: "in",
      sentAt: 200,
    },
    { code: "CAT-CCCC33", name: "ada", direction: "out", sentAt: 150 },
  ]);
  assert.equal(rows.length, 2);
  const incoming = rows.find((row) => row.direction === "in");
  const outgoing = rows.find((row) => row.direction === "out");
  assert.equal(incoming?.name, "ada");
  assert.ok(outgoing);
});

test("request time copy stays short", () => {
  const now = Date.parse("2026-09-25T12:00:00Z");
  assert.equal(formatRequestTime(now - 10_000, now), "Just now");
  assert.equal(formatRequestTime(now - 5 * 60_000, now), "5m ago");
  assert.equal(formatRequestTime(now - 3 * 3_600_000, now), "3h ago");
});

test("friends list keeps one row per code and drops generated names", () => {
  const friends = normalizeFriends([
    { code: "CAT-DDDD44", name: "kai" },
    { code: "CAT-DDDD44", name: "kai 2" },
    { code: "xx" },
  ]);
  assert.equal(friends.length, 1);
  assert.equal(friends[0]?.name, "kai");
});

test("incoming request records keep a sent time", () => {
  const row = normalizeFriendRequest({
    fromCode: "CAT-EEEE55",
    name: "jun",
    direction: "in",
  });
  assert.ok(row);
  assert.equal(row?.code, "CAT-EEEE55");
  assert.equal(row?.name, "jun");
  assert.equal(row?.direction, "in");
  assert.ok((row?.sentAt ?? 0) > 0);
});
