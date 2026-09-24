const params = new URLSearchParams(window.location.search);
const name = params.get("app") || "This site";
const host = params.get("host") || "";
const tier = params.get("tier") || "";
const next =
  params.get("next") || "https://catalyst-study.vercel.app/unlocks";

const title = document.getElementById("title");
const copy = document.getElementById("copy");
const detail = document.getElementById("detail");
const unlock = document.getElementById("unlock");

title.textContent = `${name} is locked`;
copy.textContent =
  "Lock hours are on. Catalyst only blocks distracting sites — Docs, Classroom, and the rest of the school allowlist stay open.";
detail.textContent = [
  host ? host : "",
  tier === "nemesis"
    ? "Nemesis · spend Tier 3 + 1 extra token"
    : tier === "tier3"
      ? "Tier 3 social"
      : tier === "tier2"
        ? "Tier 2"
        : "",
]
  .filter(Boolean)
  .join(" · ");
unlock.href = next;
