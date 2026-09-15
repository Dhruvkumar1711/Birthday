import confetti from 'canvas-confetti';

export function fireConfetti(duration = 2000, colorMap = null) {
  const end = Date.now() + duration;
  const colors = colorMap || ['#ff9a9e', '#fecfef', '#a18cd1', '#fbc2eb', '#ffb199', '#fad0c4'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function firePointConfetti(x, y, colors, particleCount = 25, spread = 35) {
  confetti({
    particleCount,
    spread,
    origin: { x, y },
    colors: colors || ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a18cd1', '#ff9a9e']
  });
}

export function startFinaleFireworks(duration = 15000) {
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);

  return () => clearInterval(interval);
}
