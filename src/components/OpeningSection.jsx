import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useSound } from '../context/SoundContext';
import { fireConfetti } from '../utils/confetti';

export default function OpeningSection({ onNext }) {
  const { startMusic } = useSound();
  const textRef = useRef(null);


  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: `${Math.random() * 3 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3,
      duration: `${Math.random() * 2 + 1}s`
    }));
  }, []);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  const handleEnter = () => {
    startMusic();
    fireConfetti();
    if (onNext) onNext();
  };

  return (
    <section id="opening" className="fullscreen-section active">
      <div className="stars" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: '#fff',
              borderRadius: '50%',
              opacity: star.opacity,
              animation: `starTwinkle ${star.duration} infinite alternate`
            }}
          />
        ))}
      </div>
      <div className="intro-content">
        <h1 ref={textRef} className="intro-text">
          Someone very special has a surprise waiting...
        </h1>
        <button id="enter-btn" className="glow-on-hover" onClick={handleEnter}>
          Tap to Enter ✨
        </button>
      </div>
    </section>
  );
}
