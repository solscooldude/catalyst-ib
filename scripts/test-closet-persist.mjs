import { createRequire } from "node:module";

const memory = new Map();
const localStorage = {
  getItem(key) {
    return memory.has(key) ? memory.get(key) : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
};

globalThis.window = { localStorage };
globalThis.localStorage = localStorage;
globalThis.document = { documentElement: { classList: { toggle() {} }, style: {} } };

const require = createRequire(import.meta.url);

async function main() {
  const { AUTH_SESSION_KEY } = await import("../src/lib/constants.ts");
  const { writeCloset, mergeAppearance, closetKey } = await import(
    "../src/lib/closet.ts"
  );
  const { hydrateStore, getSnapshot } = await import("../src/lib/store-core.ts");
  const { buyAppearance } = await import("../src/lib/store.ts");
  const { STORAGE_KEY } = await import("../src/lib/constants.ts");

  const userId = "user-closet-test";
  localStorage.setItem(AUTH_SESSION_KEY, userId);

  hydrateStore(userId);
  const start = getSnapshot();
  start.tokens = 160;
  const accountKey = `${STORAGE_KEY}:user:${userId}`;

  const rose = buyAppearance("sparkTint", "rose");
  if (!rose.ok) throw new Error(`buy rose failed: ${rose.reason}`);
  const bow = buyAppearance("gear", "bow");
  if (!bow.ok) throw new Error(`buy bow failed: ${bow.reason}`);
  const cape = buyAppearance("gear", "cape");
  if (!cape.ok) throw new Error(`buy cape failed: ${cape.reason}`);
  const mintHalo = buyAppearance("aura", "mint");
  if (!mintHalo.ok) throw new Error(`buy mint aura failed: ${mintHalo.reason}`);
  const vapor = buyAppearance("trail", "vapor");
  if (!vapor.ok) throw new Error(`buy vapor failed: ${vapor.reason}`);

  const afterBuy = getSnapshot().appearance;
  if (!afterBuy.ownedSparkTints.includes("rose")) {
    throw new Error("rose missing in memory after buy");
  }
  if (!afterBuy.ownedGear.includes("bow")) {
    throw new Error("bow missing in memory after buy");
  }
  if (!afterBuy.ownedGear.includes("cape") || afterBuy.gear !== "cape") {
    throw new Error("cape missing or not equipped after buy");
  }
  if (!afterBuy.ownedAuras.includes("mint") || afterBuy.aura !== "mint") {
    throw new Error("mint aura missing or not equipped after buy");
  }
  if (!afterBuy.ownedTrails.includes("vapor")) {
    throw new Error("vapor missing in memory after buy");
  }

  const rawAccount = JSON.parse(localStorage.getItem(accountKey));
  if (!rawAccount.appearance.ownedSparkTints.includes("rose")) {
    throw new Error("account JSON lost rose");
  }
  const closet = JSON.parse(localStorage.getItem(closetKey(userId)));
  if (!closet.ownedGear.includes("bow") || !closet.ownedGear.includes("cape")) {
    throw new Error("closet JSON lost clothes");
  }
  if (!closet.ownedAuras.includes("mint") || closet.aura !== "mint") {
    throw new Error("closet JSON lost mint aura");
  }

  // Wipe in-memory store, keep storage — same as a refresh.
  hydrateStore(userId);
  const reloaded = getSnapshot().appearance;
  if (!reloaded.ownedSparkTints.includes("rose") || reloaded.sparkTint !== "rose") {
    throw new Error(`rose not owned/equipped after hydrate: ${JSON.stringify(reloaded)}`);
  }
  if (!reloaded.ownedGear.includes("bow")) {
    throw new Error(`bow not owned after hydrate: ${JSON.stringify(reloaded)}`);
  }
  if (!reloaded.ownedGear.includes("cape") || reloaded.gear !== "cape") {
    throw new Error(`cape not owned/equipped after hydrate: ${JSON.stringify(reloaded)}`);
  }
  if (!reloaded.ownedAuras.includes("mint") || reloaded.aura !== "mint") {
    throw new Error(`mint aura not owned/equipped after hydrate: ${JSON.stringify(reloaded)}`);
  }
  if (!reloaded.ownedTrails.includes("vapor") || reloaded.trail !== "vapor") {
    throw new Error(`vapor not owned/equipped after hydrate: ${JSON.stringify(reloaded)}`);
  }

  // Account JSON missing appearance, closet still has it.
  delete rawAccount.appearance;
  localStorage.setItem(accountKey, JSON.stringify(rawAccount));
  hydrateStore(userId);
  const recovered = getSnapshot().appearance;
  if (!recovered.ownedSparkTints.includes("rose")) {
    throw new Error("closet merge did not recover rose");
  }

  writeCloset(userId, recovered);
  const merged = mergeAppearance({ ownedSparkTints: ["mint"] }, userId);
  if (!merged.ownedSparkTints.includes("rose")) {
    throw new Error("merge dropped rose when account listed only mint");
  }

  console.log("closet persist: ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
void require;
