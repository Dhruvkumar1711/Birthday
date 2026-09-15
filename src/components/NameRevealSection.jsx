import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fireConfetti } from '../utils/confetti';

export default function NameRevealSection({ name = 'NAME', onNext }) {
  const letters = name.toUpperCase().split('');
  const [showMessage, setShowMessage] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);

  const containerRef = useRef(null);
  const messageRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.name-balloon',
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.6,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          onComplete: () => {
            gsap.to('.name-balloon', {
              y: -10,
              duration: 1.2,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
              stagger: 0.1
            });

            setTimeout(() => {
              setShowMessage(true);
              fireConfetti(3000);
            }, 600);
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [name]);

  useEffect(() => {
    if (showMessage && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'elastic.out(1, 0.3)',
          onComplete: () => {
            setTimeout(() => setShowNextBtn(true), 600);
          }
        }
      );
    }
  }, [showMessage]);

  useEffect(() => {
    if (showNextBtn && nextBtnRef.current) {
      gsap.fromTo(
        nextBtnRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [showNextBtn]);

  return (
    <section id="name-reveal" className="fullscreen-section active" ref={containerRef}>
      <div id="balloon-container">
        {letters.map((char, index) => (
          <div key={index} className="name-balloon">
            {char}
          </div>
        ))}
      </div>

      {showMessage && (
        <h1 ref={messageRef} id="happy-birthday-msg">
          Happy Birthday {name} 🎉
        </h1>
      )}

      {showNextBtn && (
        <button
          ref={nextBtnRef}
          id="next-to-gallery"
          className="nav-btn glow-on-hover"
          onClick={onNext}
        >
          Next Surprise ✨
        </button>
      )}
    </section>
  );
}
