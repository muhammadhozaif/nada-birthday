import confetti from "canvas-confetti";

/**
 * Fires a high-energy dual-cannon confetti celebration across both sides of the screen.
 * Chic pink aesthetic: rose gold, blush pink, magenta, champagne, and pearl sparkles.
 */
export function fireCelebrationCannons() {
  const count = 220;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#fb7185", "#f472b6", "#fda4af", "#f43f5e", "#fff1f2", "#fef08a"],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-stage explosion waves
  fire(0.25, {
    spread: 28,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.85,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ["star"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Fires a continuous dual-cannon barrage (left and right corner cannons).
 */
export function fireSideCannons(durationMs: number = 3000) {
  const end = Date.now() + durationMs;
  const colors = ["#fb7185", "#f472b6", "#fda4af", "#fff1f2", "#f43f5e"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.85 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.85 },
      colors,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/**
 * Gentle rose-gold sparkles for when candles are blown out.
 */
export function fireCandleExtinguishSparks() {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#fb7185", "#f472b6", "#fff1f2", "#fef08a"],
    scalar: 0.75,
    ticks: 150,
    disableForReducedMotion: true,
  });
}
