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
void require;

async function main() {
  const { AUTH_SESSION_KEY, STORAGE_KEY } = await import("../src/lib/constants.ts");
  const { hydrateStore, getSnapshot } = await import("../src/lib/store-core.ts");
  const { saveProfile } = await import("../src/lib/store.ts");
  const { commitSpriteName, displaySpriteName, renameSprite } = await import(
    "../src/lib/sprite-name.ts"
  );
  const { SPRITE_NAME_KEY } = await import("../src/lib/sprite-name-persist.ts");

  const userId = "user-sprite-name-test";
  localStorage.setItem(AUTH_SESSION_KEY, userId);
  hydrateStore(userId);

  const named = renameSprite("Nova");
  if (!named.ok) throw new Error(`rename failed: ${named.reason}`);
  if (displaySpriteName(getSnapshot().spriteName) !== "Nova") {
    throw new Error("rename did not stick in memory");
  }
  if (localStorage.getItem(SPRITE_NAME_KEY) !== "Nova") {
    throw new Error("device key lost Nova");
  }

  const wiped = saveProfile({
    classYear: 2027,
    subjects: [
      "eng-a-langlit-hl",
      "spanish-b-sl",
      "history-hl",
      "biology-hl",
      "math-aa-hl",
      "visual-arts-sl",
    ],
    spriteName: "Spark",
  });
  if (!wiped.ok) throw new Error(`saveProfile failed: ${wiped.reason}`);
  if (displaySpriteName(getSnapshot().spriteName) !== "Nova") {
    throw new Error("saveProfile overwrote Nova with Spark");
  }

  hydrateStore(userId);
  if (displaySpriteName(getSnapshot().spriteName) !== "Nova") {
    throw new Error(`reload lost name: ${getSnapshot().spriteName}`);
  }

  const account = JSON.parse(localStorage.getItem(`${STORAGE_KEY}:user:${userId}`));
  if (account.spriteName !== "Nova") {
    throw new Error(`account JSON lost name: ${account.spriteName}`);
  }

  commitSpriteName("Pip");
  hydrateStore(userId);
  if (displaySpriteName(getSnapshot().spriteName) !== "Pip") {
    throw new Error("commitSpriteName did not persist across hydrate");
  }

  console.log("sprite name persist ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
