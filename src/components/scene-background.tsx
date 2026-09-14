"use client";

import type { BackgroundId } from "@/lib/appearance";

const STARS = Array.from({ length: 42 }, (_, index) => {
  const seed = ((index + 1) * 1103515245 + 12345) >>> 0;
  return {
    x: (seed % 1000) / 10,
    y: ((seed >>> 10) % 1000) / 10,
    size: 1 + (seed % 3),
    delay: ((seed >>> 4) % 80) / 10,
    duration: 3.2 + ((seed >>> 8) % 28) / 10,
  };
});

export function SceneBackground({ id }: { id: BackgroundId }) {
  if (id === "stars") {
    return (
      <div className="scene-layer scene-stars" aria-hidden>
        {STARS.map((star, index) => (
          <span
            key={index}
            className="scene-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (id === "aurora") {
    return (
      <div className="scene-layer scene-aurora" aria-hidden>
        <span className="scene-aurora-band scene-aurora-a" />
        <span className="scene-aurora-band scene-aurora-b" />
        <span className="scene-aurora-band scene-aurora-c" />
      </div>
    );
  }

  return null;
}
