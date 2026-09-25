const POLICY_MESSAGE = "CATALYST_LOCK_POLICY";
const PRESENT_MESSAGE = "CATALYST_LOCK_PRESENT";
const REQUEST_POLICY_MESSAGE = "CATALYST_LOCK_REQUEST_POLICY";

function announce() {
  window.postMessage({ type: PRESENT_MESSAGE }, window.location.origin);
  window.postMessage({ type: REQUEST_POLICY_MESSAGE }, window.location.origin);
}

function sendPolicy(policy, attempt = 0) {
  try {
    chrome.runtime.sendMessage({ type: "SET_POLICY", policy }, () => {
      const err = chrome.runtime.lastError;
      if (err && attempt < 6) {
        window.setTimeout(
          () => sendPolicy(policy, attempt + 1),
          200 * (attempt + 1),
        );
        return;
      }
      announce();
    });
  } catch {
    if (attempt < 6) {
      window.setTimeout(
        () => sendPolicy(policy, attempt + 1),
        200 * (attempt + 1),
      );
    }
  }
}

announce();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data || data.type !== POLICY_MESSAGE || !data.policy) return;
  sendPolicy(data.policy);
});
