/** Same-path hash/query switches that Next.js Link treats as a no-op. */

export const IN_PAGE_NAV_EVENT = "catalyst:in-page-nav";

export function followInPageHref(href: string) {
  if (typeof window === "undefined") return;
  const url = new URL(href, window.location.origin);
  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, "", next);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  window.dispatchEvent(new Event(IN_PAGE_NAV_EVENT));
}

export function isSamePathHref(href: string) {
  if (typeof window === "undefined") return false;
  const url = new URL(href, window.location.origin);
  return url.pathname === window.location.pathname;
}

export function onSamePathNavClick(
  event: { preventDefault: () => void },
  href: string,
) {
  if (!href.includes("#") && !href.includes("?")) return false;
  if (!isSamePathHref(href)) return false;
  event.preventDefault();
  followInPageHref(href);
  return true;
}

export function listenInPageNav(sync: () => void) {
  sync();
  window.addEventListener("hashchange", sync);
  window.addEventListener("popstate", sync);
  window.addEventListener(IN_PAGE_NAV_EVENT, sync);
  return () => {
    window.removeEventListener("hashchange", sync);
    window.removeEventListener("popstate", sync);
    window.removeEventListener(IN_PAGE_NAV_EVENT, sync);
  };
}
