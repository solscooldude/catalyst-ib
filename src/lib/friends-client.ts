"use client";

import { lookupFriendDirectory } from "@/lib/friends";
import { weeklyStudyMinutes } from "@/lib/stats";
import {
  acceptFriendRequest,
  applyFriendProfiles,
  applyFriendsState,
  cancelFriendRequest,
  declineFriendRequest,
  getSnapshot,
  refreshFriendInbox,
  refreshFriendProfilesFromDirectory,
  replaceFriendsState,
  sendFriendRequest,
} from "@/lib/store";

type Lists = {
  friends?: Parameters<typeof applyFriendsState>[0]["friends"];
  incomingRequests?: Parameters<typeof applyFriendsState>[0]["incomingRequests"];
  outgoingRequests?: Parameters<typeof applyFriendsState>[0]["outgoingRequests"];
};

function applyLists(data: Lists & { profiles?: Array<{
  code: string;
  name?: string;
  avatarUrl?: string | null;
  weeklyStudyMinutes?: number;
}> }, replace = false) {
  if (replace) replaceFriendsState(data);
  else applyFriendsState(data);
  if (data.profiles?.length) applyFriendProfiles(data.profiles);
}

export async function requestFriend(raw: string) {
  const local = sendFriendRequest(raw);
  if (!local.ok) return { ok: false as const, reason: local.reason };
  const localName =
    "friend" in local
      ? local.friend.name
      : "request" in local
        ? local.request.name
        : raw;
  try {
    const res = await fetch("/api/friends/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: raw }),
    });
    if (res.status === 503) {
      return {
        ok: true as const,
        becameFriends: !("pending" in local && local.pending),
        name: localName,
      };
    }
    const data = (await res.json()) as Lists & {
      error?: string;
      becameFriends?: boolean;
      profile?: { name?: string; code?: string };
    };
    if (res.status === 404 || data.error === "not-found") {
      if (!lookupFriendDirectory(raw)) {
        cancelFriendRequest(raw);
        return {
          ok: false as const,
          reason: "No Catalyst account uses that code.",
        };
      }
      return { ok: true as const, becameFriends: false, name: localName };
    }
    if (!res.ok) {
      return { ok: true as const, becameFriends: false, name: localName };
    }
    applyLists(data, true);
    return {
      ok: true as const,
      becameFriends: Boolean(data.becameFriends),
      name: data.profile?.name || localName,
    };
  } catch {
    return {
      ok: true as const,
      becameFriends: !("pending" in local && local.pending),
      name: localName,
    };
  }
}

export async function acceptIncoming(raw: string) {
  const local = acceptFriendRequest(raw);
  if (!local.ok) return local;
  try {
    const res = await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: raw, action: "accept" }),
    });
    if (res.ok) {
      applyLists((await res.json()) as Lists, true);
    }
  } catch {
    /* local accept already applied */
  }
  return local;
}

export async function declineIncoming(raw: string) {
  const local = declineFriendRequest(raw);
  if (!local.ok) return local;
  try {
    const res = await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: raw, action: "decline" }),
    });
    if (res.ok) applyLists((await res.json()) as Lists, true);
  } catch {
    /* local decline already applied */
  }
  return local;
}

export async function cancelOutgoing(raw: string) {
  const local = cancelFriendRequest(raw);
  if (!local.ok) return local;
  try {
    const res = await fetch("/api/friends/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: raw, action: "cancel" }),
    });
    if (res.ok) applyLists((await res.json()) as Lists, true);
  } catch {
    /* local cancel already applied */
  }
  return local;
}

export async function syncFriendsFromServer() {
  refreshFriendInbox();
  refreshFriendProfilesFromDirectory();
  try {
    const res = await fetch("/api/friends/sync", { cache: "no-store" });
    if (!res.ok) return;
    applyLists((await res.json()) as Lists, false);
  } catch {
    /* stay on local lists */
  }
}

export async function lookupFriendProfile(raw: string) {
  try {
    const res = await fetch(
      `/api/friends/lookup?code=${encodeURIComponent(raw)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      const listed = lookupFriendDirectory(raw);
      return listed
        ? {
            code: listed.code,
            name: listed.name,
            avatarUrl: listed.avatarUrl,
          }
        : null;
    }
    const data = (await res.json()) as {
      profile?: { code: string; name?: string; avatarUrl?: string | null };
    };
    return data.profile ?? null;
  } catch {
    return lookupFriendDirectory(raw);
  }
}

export async function publishIdentityToServer() {
  const snap = getSnapshot();
  try {
    const res = await fetch("/api/account/identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: snap.username,
        avatarUrl: snap.avatarUrl,
        avatarDataUrl: snap.avatarDataUrl,
        weeklyStudyMinutes: weeklyStudyMinutes(snap.logs),
        peerCodes: [
          ...snap.friends.map((row) => row.code),
          ...snap.incomingRequests.map((row) => row.code),
          ...snap.outgoingRequests.map((row) => row.code),
        ],
      }),
    });
    if (!res.ok) return;
    applyLists((await res.json()) as Lists, false);
  } catch {
    /* local identity already saved */
  }
}
