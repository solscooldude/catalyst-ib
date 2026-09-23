const POLICY_MESSAGE = "CATALYST_LOCK_POLICY";

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data || data.type !== POLICY_MESSAGE || !data.policy) return;
  chrome.runtime.sendMessage({ type: "SET_POLICY", policy: data.policy });
});
