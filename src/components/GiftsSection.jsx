import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSound } from '../context/SoundContext';
import { firePointConfetti } from '../utils/confetti';

const GIFTS = [
  { id: 0, surprise: 'You are the most amazing person! 💖' },
  { id: 1, surprise: 'Your smile lights up the room! ✨' },
  { id: 2, surprise: 'Wishing you endless happiness! 🌸' }
];

export default function GiftsSection({ onNext }) {
  const { playPop } = useSound();
  const [openedBoxes, setOpenedBoxes] = useState(new Set());
  const [currentSurprise, setCurrentSurprise] = useState('');
  const [showNextBtn, setShowNextBtn] = useState(false);

  const containerRef = useRef(null);
  const surpriseTextRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gift-box',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'back.out(1.7)'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (currentSurprise && surpriseTextRef.current) {
      gsap.fromTo(
        surpriseTextRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentSurprise]);

  useEffect(() => {
    if (showNextBtn && nextBtnRef.current) {
      gsap.fromTo(
        nextBtnRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [showNextBtn]);

  const handleBoxClick = (gift, event) => {
    if (openedBoxes.has(gift.id)) {
      setCurrentSurprise(gift.surprise);
      return;
    }

    const nextOpened = new Set(openedBoxes).add(gift.id);
    setOpenedBoxes(nextOpened);
    setCurrentSurprise(gift.surprise);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    firePointConfetti(x, y);

    playPop();

    if (nextOpened.size === GIFTS.length) {
      setTimeout(() => {
        setShowNextBtn(true);
      }, 600);
    }
  };

  return (
    <section id="gifts" className="fullscreen-section active" ref={containerRef}>
      <h2 className="section-title">Pick a Gift! 🎁</h2>

      <div className="gifts-container">
        {GIFTS.map((gift) => {
          const isOpened = openedBoxes.has(gift.id);
          return (
            <div
              key={gift.id}
              className={`gift-box ${isOpened ? 'opened' : ''}`}
              onClick={(e) => handleBoxClick(gift, e)}
              role="button"
              tabIndex={0}
              aria-label={`Gift box ${gift.id + 1}`}
            >
              <div className="ribbon" />
              <div className="box" />
            </div>
          );
        })}
      </div>

      <div
        id="surprise-text"
        ref={surpriseTextRef}
        style={{ minHeight: '60px', opacity: currentSurprise ? 1 : 0 }}
      >
        {currentSurprise}
      </div>

      {showNextBtn && (
        <button
          ref={nextBtnRef}
          id="next-to-game"
          className="nav-btn glow-on-hover"
          onClick={onNext}
        >
          Next Surprise ✨
        </button>
      )}
    </section>
  );
}
