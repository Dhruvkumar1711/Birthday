import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fireConfetti } from '../utils/confetti';

export default function EnvelopeSection({ name = 'NAME', onNext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);

  const envelopeRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    if (envelopeRef.current) {
      gsap.fromTo(
        envelopeRef.current,
        { y: 60, opacity: 0, rotationX: 30 },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.9, ease: 'power2.out' }
      );
    }
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    fireConfetti(1500);

    setTimeout(() => {
      setShowNextBtn(true);
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

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
    <section id="envelope-section" className="fullscreen-section active">
      <h2 className="section-title">Open your secret message 💌</h2>

      <div
        ref={envelopeRef}
        id="secret-envelope"
        className={`envelope ${isOpen ? 'open' : ''}`}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Secret Message Envelope"
      >
        <div className="envelope-flap" />
        <div className="envelope-paper">
          <p>
            Dear {name},
            <br />
            On this special day, may you be gifted with life's biggest joys and never-ending bliss.  Remember, you are capable of achieving anything you put your mind to. Happy Birthday!
          </p>
        </div>
      </div>

      {showNextBtn && (
        <button
          ref={nextBtnRef}
          id="next-to-finale"
          className="nav-btn glow-on-hover"
          onClick={onNext}
        >
          Grand Finale ✨
        </button>
      )}
    </section>
  );
}
