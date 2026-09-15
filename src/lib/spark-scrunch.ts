/** Peak squash driven by CSS vars + rAF. No React state on pointer move. */

const FOLLOW = 0.28;
const STIFFNESS = 0.16;
const DAMPING = 0.84;
const SETTLE = 0.01;
const MAX_X = 1.2;
const MAX_Y = 0.64;

export type SparkScrunch = {
  attach: (node: HTMLElement | null) => void;
  press: (clientY: number, height: number) => void;
  move: (clientY: number) => void;
  release: () => void;
  active: () => boolean;
  dispose: () => void;
};

export function createSparkScrunch(): SparkScrunch {
  let node: HTMLElement | null = null;
  let amount = 0;
  let target = 0;
  let vel = 0;
  let mode: "idle" | "press" | "spring" = "idle";
  let originY = 0;
  let span = 120;
  let raf = 0;
  let listening = false;

  function paint() {
    if (!node) return;
    node.style.setProperty("--scrunch-x", String(1 + (MAX_X - 1) * amount));
    node.style.setProperty("--scrunch-y", String(1 - (1 - MAX_Y) * amount));
  }

  function onWinMove(event: PointerEvent) {
    if (mode !== "press") return;
    const down = Math.max(0, event.clientY - originY);
    target = Math.min(1, 0.36 + down / span);
    schedule();
  }

  function bindMove() {
    if (listening) return;
    listening = true;
    window.addEventListener("pointermove", onWinMove, { passive: true });
  }

  function unbindMove() {
    if (!listening) return;
    listening = false;
    window.removeEventListener("pointermove", onWinMove);
  }

  function stop() {
    amount = 0;
    vel = 0;
    target = 0;
    mode = "idle";
    unbindMove();
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    if (!node) return;
    node.classList.remove("is-scrunching", "is-scrunch-release");
    node.style.removeProperty("--scrunch-x");
    node.style.removeProperty("--scrunch-y");
  }

  function tick() {
    raf = 0;
    if (mode === "press") {
      amount += (target - amount) * FOLLOW;
      if (Math.abs(target - amount) > SETTLE) schedule();
    } else if (mode === "spring") {
      vel += (0 - amount) * STIFFNESS;
      vel *= DAMPING;
      amount += vel;
      if (Math.abs(amount) < SETTLE && Math.abs(vel) < SETTLE) {
        stop();
        return;
      }
      schedule();
    }
    paint();
  }

  function schedule() {
    if (!raf) raf = window.requestAnimationFrame(tick);
  }

  return {
    attach(next) {
      node = next;
    },
    press(clientY, height) {
      originY = clientY;
      span = Math.max(64, height * 0.42);
      target = 0.4;
      mode = "press";
      node?.classList.remove("is-scrunch-release");
      node?.classList.add("is-scrunching");
      bindMove();
      schedule();
    },
    move(clientY) {
      if (mode !== "press") return;
      const down = Math.max(0, clientY - originY);
      target = Math.min(1, 0.36 + down / span);
      schedule();
    },
    release() {
      if (mode === "idle") return;
      unbindMove();
      mode = "spring";
      node?.classList.add("is-scrunch-release");
      schedule();
    },
    active() {
      return mode !== "idle";
    },
    dispose() {
      stop();
      node = null;
    },
  };
}
