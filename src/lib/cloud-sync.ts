"use client";

import {
  extractCloudSnapshot,
  isCloudEmpty,
  isLocalWorthMigrating,
  type CloudSnapshot,
} from "@/lib/cloud-state";
import {
  applyCloudSnapshot,
  exportCloudSnapshot,
  getSnapshot,
  pickLegacyLocalSnapshot,
} from "@/lib/store-core";

const MIGRATED_KEY = "catalyst-v1:cloud-migrated";

export type CloudLoadResult = {
  status: "off" | "ready" | "empty" | "error";
  imported: boolean;
  message: string | null;
};

function migratedKey(userId: string) {
  return `${MIGRATED_KEY}:${userId}`;
}

export function alreadyMigrated(userId: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(migratedKey(userId)) === "1";
}

export function markMigrated(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(migratedKey(userId), "1");
}

async function putSnapshot(snapshot: CloudSnapshot) {
  const res = await fetch("/api/account/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ snapshot }),
  });
  if (!res.ok) throw new Error("cloud-save-failed");
}

export async function loadCloudState(userId: string): Promise<CloudLoadResult> {
  try {
    const res = await fetch("/api/account/state", { cache: "no-store" });
    if (res.status === 503) {
      return {
        status: "off",
        imported: false,
        message: "Connect Clerk to sync this account across browsers.",
      };
    }
    if (!res.ok) {
      return {
        status: "error",
        imported: false,
        message: "Could not load your account from the cloud.",
      };
    }
    const data = (await res.json()) as {
      empty?: boolean;
      snapshot?: CloudSnapshot | null;
    };
    if (data.snapshot && !isCloudEmpty(data.snapshot)) {
      applyCloudSnapshot(data.snapshot);
      return { status: "ready", imported: false, message: null };
    }

    const local = pickLegacyLocalSnapshot();
    const current = extractCloudSnapshot(getSnapshot());
    const candidate =
      local && isLocalWorthMigrating(local) ? local : current;
    if (
      isLocalWorthMigrating(candidate) &&
      !alreadyMigrated(userId)
    ) {
      applyCloudSnapshot(candidate);
      await putSnapshot(candidate);
      markMigrated(userId);
      return {
        status: "ready",
        imported: true,
        message:
          "Imported this browser’s previous Catalyst data into your account once.",
      };
    }

    await putSnapshot(exportCloudSnapshot());
    return { status: "empty", imported: false, message: null };
  } catch {
    return {
      status: "error",
      imported: false,
      message: "Cloud sync is paused. Your data is still saved in this browser.",
    };
  }
}

export async function saveCloudState() {
  const snapshot = exportCloudSnapshot();
  await putSnapshot(snapshot);
  return snapshot;
}
