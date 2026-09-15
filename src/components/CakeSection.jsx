import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fireConfetti } from '../utils/confetti';

export default function CakeSection({ name = 'NAME', onNext }) {
  const [isCut, setIsCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);

  const messageRef = useRef(null);
  const nextBtnRef = useRef(null);

  const handleCutCake = () => {
    if (isCut) return;

    setIsCut(true);
    fireConfetti(2500);

    setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => {
        setShowNextBtn(true);
      }, 900);
    }, 700);
  };

  useEffect(() => {
    if (showMessage && messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
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
    <section id="cake-section" className="fullscreen-section active">
      <h2 className="section-title">
        {isCut ? 'Make a wish! ✨' : 'Click the cake to cut it 🎂'}
      </h2>

      <div id="cake-container">
        <div
          id="birthday-cake"
          className={`cake ${isCut ? 'cut' : ''}`}
          onClick={handleCutCake}
          role="button"
          tabIndex={0}
          aria-label="Birthday Cake"
        >
          {!isCut && (
            <>
              <div className="candle">
                <div className="flame" />
              </div>
              <div className="cake-top" />
              <div className="cake-middle" />
              <div className="cake-bottom" />
            </>
          )}
        </div>
      </div>

      {showMessage && (
        <div id="cake-message" ref={messageRef}>
          Happy Birthday {name} ❤️
        </div>
      )}

      {showNextBtn && (
        <button
          ref={nextBtnRef}
          id="next-to-envelope"
          className="nav-btn glow-on-hover"
          onClick={onNext}
        >
          Next Surprise ✨
        </button>
      )}
    </section>
  );
}
