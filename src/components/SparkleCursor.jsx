import React, { useEffect, useRef } from 'react';

export default function SparkleCursor() {
  const trailRef = useRef(null);

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - lastTime < 30) return;
      lastTime = now;

      if (!trailRef.current) return;
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${e.pageX}px`;
      sparkle.style.top = `${e.pageY}px`;
      trailRef.current.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div id="cursor-trail" ref={trailRef} aria-hidden="true" />;
}
