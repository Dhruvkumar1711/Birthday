import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { startFinaleFireworks } from '../utils/confetti';

export default function FinaleSection({ name = 'NAME', onRestart }) {
  const contentRef = useRef(null);

  useEffect(() => {
    const stopFireworks = startFinaleFireworks(20000);

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.4)' }
      );
    }

    return () => {
      stopFireworks();
    };
  }, []);

  return (
    <section id="finale-section" className="fullscreen-section active">
      <div className="finale-content" ref={contentRef}>
        <h1 className="giant-glow-text">HAPPY BIRTHDAY {name.toUpperCase()} 🎉</h1>
        {onRestart && (
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button className="glow-on-hover" onClick={onRestart}>
              Replay Celebration ✨
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
